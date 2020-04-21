import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { GenericInput, GenericInputPromptOptions } from './generic-input.ts';

export interface NumberPromptOptions extends GenericInputPromptOptions<number> {
    min?: number;
    max?: number;
    float?: boolean;
    round?: number;
}

export interface NumberPromptSettings extends NumberPromptOptions {
    min: number;
    max: number;
    float: boolean;
    round: number;
}

export class Number extends GenericInput<number, NumberPromptOptions, NumberPromptSettings> {

    public static async prompt( options: NumberPromptOptions ): Promise<number | undefined> {

        return new this( {
            min: -Infinity,
            max: Infinity,
            float: false,
            round: 2,
            ...options
        } ).run();
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
        if ( !isNaN( char as any ) ||
            ( this.settings.float && char === '.' && this.input.length && this.input.indexOf( '.' ) === -1 ) ) {
            super.addChar( char );
        }
    }

    protected sanitize( value: string ): number | undefined {

        if ( !value || isNaN( value as any ) ) {
            return;
        }

        const val: number = parseFloat( value );

        if ( this.settings.float ) {
            return parseFloat( val.toFixed( this.settings.round ) );
        }

        return val;
    }

    protected validate( value: number | undefined ): boolean | string {

        if ( typeof value !== 'number' ) {
            return false;
        }

        if ( value > this.settings.max ) {
            return `Value must be lower or equal than ${ this.settings.max }`;
        }

        if ( value < this.settings.min ) {
            return `Value must be greater or equal than ${ this.settings.min }`;
        }

        return true;
    }

    protected transform( value: number ): number {
        return value;
    }
}
