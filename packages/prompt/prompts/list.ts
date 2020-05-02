import { encode } from 'https://deno.land/std@v0.41.0/encoding/utf8.ts';
import { blue, bold, dim, underline, yellow } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { stripeColors } from '../../table/lib/utils.ts';
import { Figures } from '../lib/figures.ts';
import { GenericInput, GenericInputPromptOptions, GenericInputPromptSettings } from '../lib/generic-input.ts';

export interface ListOptions extends GenericInputPromptOptions<string[]> {
    separator?: string;
}

export interface ListSettings extends GenericInputPromptSettings<string[]> {
    separator: string;
}

export class List extends GenericInput<string[], ListSettings> {

    public static async prompt( options: string | ListOptions ): Promise<string[] | undefined> {

        if ( typeof options === 'string' ) {
            options = { message: options };
        }

        return new this( {
            pointer: blue( Figures.POINTER_SMALL ),
            separator: ',',
            ...options
        } ).prompt();
    }

    protected setPrompt( message: string ) {

        message += ' ' + this.settings.pointer + ' ';

        const length = encode( stripeColors( message ) ).length;

        const oldInput: string = this.input;
        const oldInputParts: string[] = oldInput.trimLeft().split( this.regexp() );

        this.input = oldInputParts.join( `${ this.settings.separator } ` );

        message += oldInputParts.map( ( val: string ) => underline( val ) ).join( `${ this.settings.separator } ` );

        const inputDiff = oldInput.length - this.input.length;

        this.index -= inputDiff;

        this.write( message );

        this.screen.cursorTo( length - 1 + this.index );
    }

    protected regexp() {
        return new RegExp( this.settings.separator === ' ' ? ` +` : ` *${ this.settings.separator } *` );
    }

    protected addChar( char: string ): void {
        switch ( char ) {
            case this.settings.separator:
                if ( this.input.length && this.input.trim().slice( -1 ) !== this.settings.separator ) {
                    super.addChar( char );
                }
                break;
            default:
                super.addChar( char );
        }
    }

    protected deleteChar(): void {
        if ( this.input[ this.index - 1 ] === ' ' ) {
            super.deleteChar();
        }
        super.deleteChar();
    }

    protected transform( value: string ): string[] {
        return value.trim().split( this.regexp() );
    }

    protected validate( value: string[] | undefined ): boolean | string {
        return Array.isArray( value ) && ( value.every( ( val: string ) => val.trim().length > 0 ) || 'Value cannot be empty.' );
    }

    protected format( value: string[] ): string {
        return value.join( `, ` );
    }
}
