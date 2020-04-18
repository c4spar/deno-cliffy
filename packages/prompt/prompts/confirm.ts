import { encode } from 'https://deno.land/std@v0.41.0/encoding/utf8.ts';
import { bold, dim, underline, yellow } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { stripeColors } from '../../table/lib/utils.ts';
import { GenericInput, GenericInputPromptOptions } from './generic-input.ts';

export interface ConfirmPromptOptions extends GenericInputPromptOptions<boolean> {
    mode?: 'default' | 'legacy';
    defaultText?: string;
}

export class Confirm extends GenericInput<boolean, ConfirmPromptOptions> {

    public static async prompt( options: ConfirmPromptOptions ): Promise<boolean | undefined> {

        return new this( {
            mode: 'default',
            ...options
        } ).run();
    }

    public prompt(): void {
        if ( this.options.mode === 'legacy' ) {
            this.promptLegacy();
        } else {
            this.promptFancy();
        }
    }

    protected promptLegacy() {

        let message = ` ${ yellow( '?' ) } ${ bold( this.options.message ) } `;

        if ( this.options.defaultText ) {
            message += dim( `(${ this.options.defaultText })` );
        } else if ( this.options.default === true ) {
            message += dim( '(Y/n)' );
        } else if ( this.options.default === false ) {
            message += dim( '(y/N)' );
        } else {
            message += dim( '(y/n)' );
        }

        message += ' ' + this.options.pointer + ' ';

        const length = encode( stripeColors( message ) ).length;

        message += underline( this.input );

        this.write( message );

        this.screen.cursorTo( length - 1 + this.index );
    }

    protected promptFancy() {

        let message = ` ${ yellow( '?' ) } ${ bold( this.options.message ) } ${ this.options.pointer } `;

        if ( this.input === 'yes' ) {
            message += `${ dim( 'no /' ) } ${ underline( 'yes' ) }`;
        } else if ( this.input === 'no' ) {
            message += `${ underline( 'no' ) } ${ dim( '/ yes' ) }`;
        } else {
            message += dim( 'no / yes' );
        }

        this.write( message );
    }

    protected async read(): Promise<boolean> {

        if ( this.options.mode !== 'legacy' ) {
            this.screen.cursorHide();
        }

        return super.read();
    }

    protected async handleEvent( event: KeyEvent ): Promise<boolean> {

        if ( this.options.mode === 'legacy' ) {
            return super.handleEvent( event );
        }

        switch ( event.name ) {

            case 'c':
                if ( event.ctrl ) {
                    return Deno.exit( 0 );
                }
                break;

            case 'n':
            case 'left':
                this.selectNo();
                break;

            case 'y':
            case 'right':
                this.selectYes();
                break;

            case 'return':
            case 'enter':
                return this.selectValue();
        }

        return false;
    }

    protected selectYes() {
        this.input = 'yes';
    }

    protected selectNo() {
        this.input = 'no';
    }

    protected sanitize( value: string ): boolean | undefined {

        switch ( value.toLowerCase() ) {

            case 'y':
            case 'yes':
                return true;

            case 'n':
            case 'no':
                return false;
        }

        return;
    }

    protected validate( value: boolean | undefined ): boolean {
        return typeof value === 'boolean';
    }

    protected transform( value: boolean ): any {
        return value ? 'Yes' : 'No';
    }
}
