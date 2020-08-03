import { blue } from 'https://deno.land/std@0.63.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { Figures } from '../lib/figures.ts';
import { GenericInput, GenericInputKeys, GenericInputPromptOptions, GenericInputPromptSettings } from '../lib/generic-input.ts';

export interface NumberKeys extends GenericInputKeys {
    increaseValue?: string[];
    decreaseValue?: string[];
}

interface NumberKeysSettings extends GenericInputKeys {
    increaseValue: string[];
    decreaseValue: string[];
}

export interface NumberOptions extends GenericInputPromptOptions<number> {
    min?: number;
    max?: number;
    float?: boolean;
    round?: number;
    keys?: NumberKeys;
}

interface NumberSettings extends GenericInputPromptSettings<number> {
    min: number;
    max: number;
    float: boolean;
    round: number;
    keys: NumberKeysSettings;
}

export class Number extends GenericInput<number, NumberSettings> {

    public static async prompt( options: string | NumberOptions ): Promise<number> {

        if ( typeof options === 'string' ) {
            options = { message: options };
        }

        return new this( {
            pointer: blue( Figures.POINTER_SMALL ),
            min: -Infinity,
            max: Infinity,
            float: false,
            round: 2,
            ...options,
            keys: {
                increaseValue: [ 'up', 'u', '+' ],
                decreaseValue: [ 'down', 'd', '-' ],
                ...( options.keys ?? {} )
            }
        } ).prompt();
    }

    protected async handleEvent( event: KeyEvent ): Promise<boolean> {

        switch ( true ) {

            case event.name === 'c':
                if ( event.ctrl ) {
                    this.screen.cursorShow();
                    return Deno.exit( 0 );
                }
                break;

            case this.isKey( this.settings.keys, 'increaseValue', event ):
                this.increaseValue();
                break;

            case this.isKey( this.settings.keys, 'decreaseValue', event ):
                this.decreaseValue();
                break;

            case this.isKey( this.settings.keys, 'moveCursorLeft', event ):
                this.moveCursorLeft();
                break;

            case this.isKey( this.settings.keys, 'moveCursorRight', event ):
                this.moveCursorRight();
                break;

            case this.isKey( this.settings.keys, 'deleteCharRight', event ):
                this.deleteCharRight();
                break;

            case this.isKey( this.settings.keys, 'deleteCharLeft', event ):
                this.deleteChar();
                break;

            case this.isKey( this.settings.keys, 'submit', event ):
                return true;

            default:
                if ( event.sequence && !event.meta && !event.ctrl ) {
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

        if ( isNumeric( char ) ) {
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

    protected validate( value: string ): boolean | string {

        if ( !isNumeric( value ) ) {
            return false;
        }

        const val: number = parseFloat( value );

        if ( val > this.settings.max ) {
            return `Value must be lower or equal than ${ this.settings.max }`;
        }

        if ( val < this.settings.min ) {
            return `Value must be greater or equal than ${ this.settings.min }`;
        }

        return true;
    }

    protected transform( value: string ): number | undefined {

        const val: number = parseFloat( value );

        if ( this.settings.float ) {
            return parseFloat( val.toFixed( this.settings.round ) );
        }

        return val;
    }

    protected format( value: number ): string {
        return value.toString();
    }
}

function isNumeric( value: string | number ): value is ( number | string ) {
    return typeof value === 'number' || ( !!value && !isNaN( value as any ) );
}
