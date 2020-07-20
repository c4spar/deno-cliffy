import { encode } from 'https://deno.land/std@v0.61.0/encoding/utf8.ts';
import { blue, bold, dim, green, red, yellow } from 'https://deno.land/std@v0.61.0/fmt/colors.ts';
import { AnsiEscape } from '../../ansi-escape/lib/ansi-escape.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import format from '../../x/format.ts';
import { Figures } from './figures.ts';
import { readKeySync } from './read-line.ts';

export type ValidateResult = string | boolean | Promise<string | boolean>;

export interface GenericPromptOptions<T, V> {
    message: string;
    default?: T;
    validate?: ( value: V ) => ValidateResult;
    transform?: ( value: V ) => T | undefined;
    hint?: string;
    pointer?: string;
}

export interface GenericPromptSettings<T, V> extends GenericPromptOptions<T, V> {
    pointer: string;
}

export abstract class GenericPrompt<T, V, S extends GenericPromptSettings<T, V>> {

    protected static injectedValue: any | undefined;

    protected screen = AnsiEscape.from( Deno.stdout );
    protected lastError: string | undefined;
    protected isRunning: boolean = false;
    protected value: T | undefined;

    public static inject( value: any ): void {
        GenericPrompt.injectedValue = value;
    }

    protected constructor( protected settings: S ) {}

    public async prompt(): Promise<T> {
        try {
            const result: T = await this.execute();
            this.screen.cursorShow();
            return result;
        } catch ( e ) {
            this.screen.cursorShow();
            throw e;
        }
    }

    protected abstract setPrompt( message: string ): void | Promise<void>;

    protected abstract async handleEvent( event: KeyEvent ): Promise<boolean>;

    protected abstract transform( value: V ): T | undefined;

    protected abstract validate( value: V ): ValidateResult;

    protected abstract format( value: T ): string;

    protected abstract getValue(): V;

    protected clear() {
        this.screen
            .cursorLeft()
            .eraseDown();
    }

    protected async execute(): Promise<T> {

        if ( this.lastError || this.isRunning ) {
            this.clear();
        }

        this.isRunning = true;

        // be sure there are empty lines after the cursor to fix restoring the cursor if terminal output is bigger than terminal window.
        const message: string = await this.getMessage();
        this.preBufferEmptyLines( this.lastError || this.settings.hint || '' );

        await this.setPrompt( message );

        if ( this.lastError || this.settings.hint ) {
            this.screen.cursorSave();
            this.writeLine();
            if ( this.lastError ) {
                this.error( this.lastError );
                this.lastError = undefined;
            } else if ( this.settings.hint ) {
                this.hint( this.settings.hint );
            }
            this.screen.cursorRestore();
        }

        if ( !await this.read() ) {
            return this.execute();
        }

        if ( typeof this.value === 'undefined' ) {
            throw new Error( 'internal error: failed to read value' );
        }

        this.clear();
        this.writeLine( await this.getSuccessMessage( this.value ) );

        this.screen.cursorShow();

        GenericPrompt.injectedValue = undefined;
        this.isRunning = false;

        return this.value;
    }

    protected getMessage(): string | Promise<string> {

        let message = ` ${ yellow( '?' ) } ${ bold( this.settings.message ) }`;

        if ( typeof this.settings.default !== 'undefined' ) {
            message += dim( ` (${ this.format( this.settings.default ) })` );
        }

        return message;
    }

    protected async getSuccessMessage( value: T ) {
        return `${ await this.getMessage() } ${ this.settings.pointer } ${ green( this.format( value ) ) }`;
    }

    protected async read(): Promise<boolean> {

        if ( typeof GenericPrompt.injectedValue !== 'undefined' ) {
            const value: V = GenericPrompt.injectedValue;
            return this.validateValue( value );
        }

        const event: KeyEvent | undefined = await readKeySync();

        if ( !event ) {
            return false;
        }

        const done: boolean = await this.handleEvent( event );

        if ( done ) {
            return this.validateValue( this.getValue() );
        }

        return false;
    }

    protected transformValue( value: V ): T | undefined {
        return this.settings.transform ? this.settings.transform( value ) : this.transform( value );
    }

    protected async validateValue( value: V ): Promise<boolean> {

        if ( !value && typeof this.settings.default !== 'undefined' ) {
            this.value = this.settings.default;
            return true;
        }

        const validation = await ( this.settings.validate ? this.settings.validate( value ) : this.validate( value ) );

        if ( validation === false ) {
            this.lastError = `Invalid answer.`;
        } else if ( typeof validation === 'string' ) {
            this.lastError = validation;
        } else {
            this.value = this.transformValue( value );
        }

        return !this.lastError;
    }

    protected isKey<K extends any, N extends keyof K>( keys: K | undefined, name: N, event: KeyEvent ): boolean {
        const keyNames: any | undefined = keys?.[ name ];
        return typeof keyNames !== 'undefined' && (
            ( typeof event.name !== 'undefined' && keyNames.indexOf( event.name ) !== -1 ) ||
            ( typeof event.sequence !== 'undefined' && keyNames.indexOf( event.sequence ) !== -1 )
        );
    }

    protected write( ...args: any[] ) {
        Deno.stdout.writeSync( encode( format( ...args ) ) );
    }

    protected writeLine( ...args: any[] ) {
        Deno.stdout.writeSync( encode( format( ...args ) + '\n' ) );
    }

    protected preBufferEmptyLines( message: string ) {
        const linesCount: number = message.split( '\n' ).length;
        this.write( '\n'.repeat( linesCount ) );
        this.screen.cursorUp( linesCount );
    }

    protected error( ...args: any[] ) {
        if ( typeof GenericPrompt.injectedValue !== 'undefined' ) {
            throw new Error( red( bold( ` ${ Figures.CROSS } ` ) + format( ...args ) ) );
        }
        this.write( red( bold( ` ${ Figures.CROSS } ` ) + format( ...args ) ) );
    }

    protected message( ...args: any[] ) {
        this.write( blue( ` ${ Figures.POINTER } ` ) + format( ...args ) );
    }

    protected hint( ...args: any[] ) {
        this.write( dim( blue( ` ${ Figures.POINTER } ` ) + format( ...args ) ) );
    }
}
