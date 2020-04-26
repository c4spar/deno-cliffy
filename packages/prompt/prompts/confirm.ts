import { encode } from 'https://deno.land/std@v0.41.0/encoding/utf8.ts';
import { blue, bold, dim, underline, yellow } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { stripeColors } from '../../table/lib/utils.ts';
import { Figures } from '../lib/figures.ts';
import { GenericInput, GenericInputPromptOptions, GenericInputPromptSettings } from './generic-input.ts';

export interface ConfirmPromptOptions extends GenericInputPromptOptions<boolean> {
    active?: string;
    inactive?: string;
}

export interface ConfirmPromptSettings extends GenericInputPromptSettings<boolean> {
    active: string;
    inactive: string;
}

export class Confirm extends GenericInput<boolean, ConfirmPromptSettings> {

    public static async prompt( options: ConfirmPromptOptions ): Promise<boolean | undefined> {

        return new this( {
            active: 'y',
            inactive: 'n',
            pointer: blue( Figures.POINTER_SMALL ),
            ...options
        } ).run();
    }

    public prompt(): void {

        let message = ` ${ yellow( '?' ) } ${ bold( this.settings.message ) } `;

        if ( this.settings.default === true ) {
            message += dim( `(${ this.settings.active.toUpperCase() }/${ this.settings.inactive.toLowerCase() })` );
        } else if ( this.settings.default === false ) {
            message += dim( `(${ this.settings.active.toLowerCase() }/${ this.settings.inactive.toUpperCase() })` );
        } else {
            message += dim( `(${ this.settings.active.toLowerCase() }/${ this.settings.inactive.toLowerCase() })` );
        }

        message += ' ' + this.settings.pointer + ' ';

        const length = encode( stripeColors( message ) ).length;

        message += underline( this.input );

        this.write( message );

        this.screen.cursorTo( length - 1 + this.index );
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

    protected transform( value: boolean ): string {
        return value ? 'Yes' : 'No';
    }
}
