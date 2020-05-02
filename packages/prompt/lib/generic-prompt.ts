import { encode } from 'https://deno.land/std@v0.41.0/encoding/utf8.ts';
import { bold, dim, red, yellow } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { AnsiEscape } from '../../ansi-escape/lib/ansi-escape.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import format from '../../x/format.ts';
import { Figures } from './figures.ts';
import { readKeySync } from './read-line.ts';

export type ValidateResult = string | boolean | Promise<string | boolean>;

export interface GenericPromptOptions<T, V> {
    message: string;
    pointer?: string;
    default?: T;
    sanitize?: ( value: V ) => T | undefined;
    validate?: ( value: T | undefined ) => ValidateResult;
    transform?: ( value: T ) => string;
}

export interface GenericPromptSettings<T, V> extends GenericPromptOptions<T, V> {
    pointer: string;
}

export abstract class GenericPrompt<T, V, S extends GenericPromptSettings<T, V>> {

    protected screen = AnsiEscape.from( Deno.stdout );
    protected lastError: string | undefined;
    protected isRunning: boolean = false;
    protected value: T | undefined;

    protected constructor( protected settings: S ) {}

    public async prompt(): Promise<T | undefined> {
        return this.execute();
    }

    protected abstract setPrompt( message: string ): void | Promise<void>;

    protected abstract async handleEvent( event: KeyEvent ): Promise<boolean>;

    protected abstract sanitize( value: V ): T | undefined;

    protected abstract validate( value: T | undefined ): ValidateResult;

    protected abstract transform( value: T ): string;

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

        await this.setPrompt( await this.getMessage() );

        if ( this.lastError ) {
            this.screen.cursorSave();
            this.writeLine();
            this.error( this.lastError );
            this.screen.cursorRestore();
            this.lastError = undefined;
        }

        if ( !await this.read() ) {
            return this.execute();
        }

        this.screen.cursorUp(); // move cursor up by 1 because the use hit enter
        this.clear();
        this.writeLine( `${ await this.getMessage() } ${ this.settings.pointer } ${ yellow( this.transform( this.value as T ) ) }` );

        this.screen.cursorShow();

        this.isRunning = false;

        return this.value;
    }

    protected getMessage(): string | Promise<string> {

        let message = ` ${ yellow( '?' ) } ${ bold( this.settings.message ) }`;

        if ( typeof this.settings.default !== 'undefined' ) {
            message += dim( ` (${ this.transform( this.settings.default ) })` );
        }

        return message;
    }

    protected async read(): Promise<boolean> {

        const event: KeyEvent | undefined = await readKeySync();

        if ( !event ) {
            return false;
        }

        return this.handleEvent( event );
    }

    protected sanitizeValue( value: V ): T | undefined {

        if ( !value && typeof this.settings.default !== 'undefined' ) {
            return this.settings.default;
        }

        return this.settings.sanitize ? this.settings.sanitize( value ) : this.sanitize( value );
    }

    protected async validateValue( value: V ): Promise<boolean> {

        this.value = this.sanitizeValue( value );

        const validation = await ( this.settings.validate ? this.settings.validate( this.value ) : this.validate( this.value ) );

        if ( validation === false ) {

            this.lastError = `Invalid answer.`;

        } else if ( typeof validation === 'string' ) {

            this.lastError = validation;
        }

        return !this.lastError;
    }

    protected write( ...args: any[] ) {
        Deno.stdout.writeSync( encode( ...args ) );
    }

    protected writeLine( ...args: any[] ) {
        Deno.stdout.writeSync( encode( format( ...args ) + '\n' ) );
    }

    protected error( ...args: any[] ) {
        this.write( red( bold( ` ${ Figures.CROSS } ` ) + format( ...args ) ) + '\n' );
    }
}
