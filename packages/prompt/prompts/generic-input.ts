import { encode } from 'https://deno.land/std@v0.41.0/encoding/utf8.ts';
import { blue, bold, dim, underline, yellow } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { stripeColors } from '../../table/lib/utils.ts';
import { Figures } from '../lib/figures.ts';
import { PromptModule, PromptModuleOptions } from '../lib/prompt-module.ts';

export interface GenericInputPromptOptions<T> extends PromptModuleOptions<T> {
    pointer?: string;
}

export interface GenericInputPromptSettings<T> extends GenericInputPromptOptions<T> {

}

export abstract class GenericInput<T, O extends GenericInputPromptOptions<T>, S extends GenericInputPromptSettings<T>> extends PromptModule<T, O, S> {

    protected input: string = '';
    protected index: number = 0;

    protected constructor( options: S ) {
        super( {
            pointer: blue( Figures.POINTER_SMALL ),
            ...options
        } );
    }

    public prompt(): void {

        let message = ` ${ yellow( '?' ) } ${ bold( this.settings.message ) }`;

        if ( this.settings.default ) {
            message += ' ' + dim( `(${ this.settings.default })` );
        }

        message += ' ' + this.settings.pointer + ' ';

        const length = encode( stripeColors( message ) ).length;

        message += underline( this.input );

        this.write( message );

        this.screen.cursorTo( length - 1 + this.index );
    }

    protected async handleEvent( event: KeyEvent ): Promise<boolean> {

        switch ( event.name ) {

            case 'c':
                if ( event.ctrl ) {
                    return Deno.exit( 0 );
                }
                break;

            case 'up': // scroll history?
                break;

            case 'down':  // scroll history?
                break;

            case 'left':
                this.moveCursorLeft();
                break;

            case 'right':
                this.moveCursorRight();
                break;

            case 'delete':
                this.deleteChar();
                break;

            case 'backspace':
                this.removeChar();
                break;

            case 'return':
            case 'enter':
                return this.selectValue();

            default:
                if ( event.sequence ) {
                    this.addChar( event.sequence );
                }
                break;
        }

        return false;
    }

    protected addChar( char: string ): void {

        this.input = this.input.slice( 0, this.index ) + char + this.input.slice( this.index );
        this.index++;
    }

    protected moveCursorLeft(): void {

        if ( this.index > 0 ) {
            this.index--;
        }
    }

    protected moveCursorRight(): void {

        if ( this.index < this.input.length ) {
            const index = this.input.indexOf( ' ', this.index );
            this.index++;
        }
    }

    protected removeChar(): void {

        if ( this.index > 0 ) {
            this.index--;
            this.screen.cursorBackward( 1 );
            this.input = this.input.slice( 0, this.index ) + this.input.slice( this.index + 1 );
        }
    }

    protected deleteChar(): void {
        if ( this.index < this.input.length ) {
            this.input = this.input.slice( 0, this.index ) + this.input.slice( this.index + 1 );
        }
    }

    protected async selectValue(): Promise<boolean> {

        const isValid = await this.validateValue( this.input );
        if ( isValid ) {
            this.writeLine();
        }
        return isValid;
    }
}
