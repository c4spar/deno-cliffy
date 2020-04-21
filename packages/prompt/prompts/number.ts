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

    protected manipulateIndex( decrease?: boolean ) {

        if ( this.input[ this.index ] === '-' ) {
            this.index++;
        }

        if ( this.input.length && ( this.index > this.input.length - 1 ) ) {
            this.index--;
        }

        const decimalIndex: number = this.input.indexOf( '.' );
        const [ abs, dec ] = this.input.split( '.' );

        if ( dec && this.index === decimalIndex ) {
            this.index--;
        }

        const inDecimal: boolean = decimalIndex !== -1 && this.index > decimalIndex;
        let value: string = ( inDecimal ? dec : abs ) || '0';
        const oldLength: number = this.input.length;
        const index: number = inDecimal ? this.index - decimalIndex - 1 : this.index;
        const increaseValue = Math.pow( 10, value.length - index - 1 );

        value = ( parseInt( value ) + ( decrease ? -increaseValue : increaseValue ) ).toString();

        this.input = !dec ? value : ( this.index > decimalIndex ? abs + '.' + value : value + '.' + dec );

        if ( this.input.length > oldLength ) {
            this.index++;
        } else if ( this.input.length < oldLength && this.input[ this.index - 1 ] !== '-' ) {
            this.index--;
        }

        this.index = Math.max( 0, Math.min( this.index, this.input.length - 1 ) );
    }

    public increaseValue() {
        this.manipulateIndex( false );
    }

    public decreaseValue() {
        this.manipulateIndex( true );
    }

    protected addChar( char: string ): void {

        if ( !isNaN( char as any ) ) {
            super.addChar( char );
        } else if (
            this.settings.float &&
            char === '.' &&
            this.input.indexOf( '.' ) === -1 &&
            ( this.input[ 0 ] === '-' ? this.index > 1 : this.index > 0 )
        ) {
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

    // protected getChar( index: number = this.index ): string {
    //     return this.input.slice( index, index + 1 );
    // }
    //
    // protected setChar( value: string | number, index: number = this.index ) {
    //     this.input = this.input.slice( 0, index ) + value.toString() + this.input.slice( index + 1 );
    // }
    //
    // public parseValue() {
    //     if ( this.input.length === 0 ) {
    //         return 0;
    //     }
    //
    //     const value: number = parseFloat( this.input );
    //
    //     if ( value < 0 ) {
    //
    //     }
    //
    //     const length = this.input.length;
    //     const value = parseFloat( this.getChar() ) || 0;
    //     this.input = this.input.slice( 0, this.index ) + ( value - 1 ) + this.input.slice( this.index + 1 );
    // }
}
