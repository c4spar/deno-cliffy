const { stdout } = Deno;
import { encode } from 'https://deno.land/std@v0.41.0/encoding/utf8.ts';
import { bold, dim, red, yellow } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { AnsiEscape } from '../../ansi-escape/lib/ansi-escape.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import format from '../../x/format.ts';
import { Figures } from './figures.ts';
import { readKeySync } from './read-line.ts';
import { PromptModuleOptions, ValidateResult } from './types.ts';

export interface PromptModuleConstructor<T, O extends PromptModuleOptions<T>> {

    new( options: O ): PromptModule<T, O>

    prompt: ( options: O ) => Promise<T | undefined>
}

export abstract class PromptModule<T, O extends PromptModuleOptions<T>> {

    protected screen = AnsiEscape.from( Deno.stdout );
    protected lastError: string | undefined;
    protected isRunning: boolean = false;
    protected value: T | undefined;

    protected constructor( protected options: O ) {}

    protected abstract prompt(): void | Promise<void>;

    protected async read(): Promise<boolean> {

        const event: KeyEvent | undefined = await readKeySync();

        if ( !event ) {
            return false;
        }

        return this.handleEvent( event );
    }

    protected abstract async handleEvent( event: KeyEvent ): Promise<boolean>;

    protected abstract sanitize( value: string | T ): T | undefined;

    protected abstract validate( value: T | undefined ): ValidateResult;

    protected abstract transform( value: T | undefined ): any;

    public async run(): Promise<T | undefined> {
        return this.execute();
    }

    protected clear() {
        this.screen.cursorLeft();
        this.screen.eraseDown();
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
        this.screen.cursorLeft();
        this.screen.eraseDown();

        this.screen.cursorShow();

        return this.value;
    }

    protected async validateValue( line: string | T ): Promise<boolean> {

        if ( !line && typeof this.options.default !== 'undefined' ) {
            line = this.options.default;
        }

        this.value = this.options.sanitize ? this.options.sanitize( line ) : this.sanitize( line );

        const validation = await ( this.options.validate ? this.options.validate( this.value ) : this.validate( this.value ) );

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
