import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { GenericInput, GenericInputPromptOptions } from './generic-input.ts';

export interface NumberPromptOptions extends GenericInputPromptOptions<number> {

}

export class Number extends GenericInput<number, NumberPromptOptions> {

    public static async prompt( options: NumberPromptOptions ): Promise<number | undefined> {

        return new this( options ).run();
    }

    protected async handleEvent( event: KeyEvent ): Promise<boolean> {

        switch ( event.name ) {

            case 'c':
                if ( event.ctrl ) {
                    return Deno.exit( 0 );
                }
                break;

            case 'up':
                this.increaseValue();
                break;

            case 'down':
                this.decreaseValue();
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

    public increaseValue() {

        if ( this.input[ this.index ] === '-' ) {
            this.index++;
        }

        let value = parseInt( this.input ) || 0;
        const oldLength = value.toString().length;
        value += parseInt( '1'.padEnd( oldLength - this.index, '0' ) );
        this.input = value.toString();
        if ( this.input.length > oldLength ) {
            this.index++;
        } else if ( this.input.length < oldLength && this.input[ this.index - 1 ] !== '-' ) {
            this.index--;
        }
        this.index = Math.max( 0, Math.min( this.index, this.input.length - 1 ) );
    }

    public decreaseValue() {

        if ( this.input[ this.index ] === '-' ) {
            this.index++;
        }

        let value = parseInt( this.input ) || 0;
        const oldLength = value.toString().length;
        value -= parseInt( '1'.padEnd( oldLength - this.index, '0' ) );
        this.input = value.toString();
        if ( this.input.length > oldLength ) {
            this.index++;
        }
        this.index = Math.max( 0, Math.min( this.index, this.input.length - 1 ) );
    }

    protected addChar( char: string ): void {
        if ( isNaN( char as any ) ) {
            return;
        }
        super.addChar( char );
    }

    protected sanitize( value: string ): number | undefined {
        return !value || isNaN( value as any ) ? undefined : parseFloat( value );
    }

    protected validate( value: number | undefined ): boolean {
        return typeof value === 'number';
    }

    protected transform( value: number ): number {
        return value;
    }
}
