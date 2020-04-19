const { stdout } = Deno;
import { encode } from 'https://deno.land/std@v0.41.0/encoding/utf8.ts';
import { bold, dim, red, yellow } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { AnsiEscape } from '../../ansi-escape/lib/ansi-escape.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import format from '../../x/format.ts';
import { Figures } from './figures.ts';
import { readKeySync } from './read-line.ts';

export type ValidateResult = string | boolean | Promise<string | boolean>;

export interface PromptModuleOptions<T> {
    message: string;
    default?: T;
    sanitize?: ( value: string ) => T | undefined;
    validate?: ( value: T | undefined ) => ValidateResult;
    transform?: ( value: T | undefined ) => boolean;
}

export interface PromptModuleSettings<T> extends PromptModuleOptions<T> {

}

export abstract class PromptModule<T, O extends PromptModuleOptions<T>, S extends PromptModuleSettings<T>> {

    protected screen = AnsiEscape.from( Deno.stdout );
    protected lastError: string | undefined;
    protected isRunning: boolean = false;
    protected value: T | undefined;

    protected constructor( protected settings: S ) {}

    protected abstract prompt(): void | Promise<void>;

    protected async read(): Promise<boolean> {

        const event: KeyEvent | undefined = await readKeySync();

        if ( !event ) {
            return false;
        }

        return this.handleEvent( event );
    }

    protected abstract async handleEvent( event: KeyEvent ): Promise<boolean>;

    protected abstract sanitize( value: string ): T | undefined;

    protected abstract validate( value: T | undefined ): ValidateResult;

    protected abstract transform( value: T | undefined ): any;

    public async run(): Promise<T | undefined> {
        return this.execute();
    }

    protected clear() {
        this.screen
            .cursorLeft()
            .eraseDown();
    }

    protected async execute(): Promise<T | undefined> {

        if ( this.lastError || this.isRunning ) {
            this.clear();
        }

        this.isRunning = true;

        await this.prompt();

        if ( this.lastError ) {
            this.screen.cursorSave();
            this.write( '\n' );
            this.error( this.lastError );
            this.screen.cursorRestore();
            this.lastError = undefined;
        }

        if ( !await this.read() ) {
            return this.execute();
        }

        this.isRunning = false;

        this.screen
            .cursorLeft()
            .eraseDown()
            .cursorShow();

        return this.value;
    }

    protected async validateValue( line: string ): Promise<boolean> {

        if ( !line && typeof this.settings.default !== 'undefined' ) {
            this.value = this.settings.default;
        } else {
            this.value = this.settings.sanitize ? this.settings.sanitize( line ) : this.sanitize( line );
        }

        const validation = await ( this.settings.validate ? this.settings.validate( this.value ) : this.validate( this.value ) );

        if ( validation === false ) {

            this.lastError = `Invalid answer.`;

        } else if ( typeof validation === 'string' ) {

            this.lastError = validation;
        }

        return !this.lastError;
    }

    protected write( ...args: any[] ) {
        stdout.writeSync( encode( ...args ) );
    }

    protected writeLine( ...args: any[] ) {
        stdout.writeSync( encode( format( ...args ) + '\n' ) );
    }

    protected error( ...args: any[] ) {
        this.write( bold( ` ${ Figures.CROSS } ` ) + red( format( ...args ) ) + '\n' );
    }

    protected question( message: string, lineBreak: boolean = false ) {
        this.write( ` ${ yellow( '?' ) } ${ bold( message ) }` + ( lineBreak ? '\n' : ' ' ) );
    }
}
