import { encode } from 'https://deno.land/std@v0.52.0/encoding/utf8.ts';
import { underline } from 'https://deno.land/std@v0.52.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { stripeColors } from '../../table/lib/utils.ts';
import { GenericPrompt, GenericPromptOptions, GenericPromptSettings } from './generic-prompt.ts';

export interface GenericInputPromptOptions<T> extends GenericPromptOptions<T, string> {}

export interface GenericInputPromptSettings<T> extends GenericPromptSettings<T, string> {}

export abstract class GenericInput<T, S extends GenericInputPromptSettings<T>> extends GenericPrompt<T, string, S> {

    protected input: string = '';
    protected index: number = 0;

    public static inject( value: string ): void {
        GenericPrompt.inject( value );
    }

    protected setPrompt( message: string ) {

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
                if ( event.sequence ) {
                    this.addChar( event.sequence );
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
                this.deleteCharRight();
                break;

            case 'backspace':
                this.deleteChar();
                break;

            case 'return':
            case 'enter':
                return true;

            default:
                if ( event.sequence && !event.meta && !event.ctrl ) {
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

    protected deleteChar(): void {
        if ( this.index > 0 ) {
            this.index--;
            this.screen.cursorBackward( 1 );
            this.input = this.input.slice( 0, this.index ) + this.input.slice( this.index + 1 );
        }
    }

    protected deleteCharRight(): void {
        if ( this.index < this.input.length ) {
            this.input = this.input.slice( 0, this.index ) + this.input.slice( this.index + 1 );
        }
    }

    protected getValue(): string {
        return this.input;
    }
}
