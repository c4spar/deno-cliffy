import { blue, bold, dim, yellow } from 'https://deno.land/std@0.63.0/fmt/colors.ts';
import { Figures } from '../lib/figures.ts';
import { GenericInput, GenericInputKeys, GenericInputPromptOptions, GenericInputPromptSettings } from '../lib/generic-input.ts';

export interface ConfirmKeys extends GenericInputKeys {}

export interface ConfirmOptions extends GenericInputPromptOptions<boolean> {
    active?: string;
    inactive?: string;
    keys?: ConfirmKeys;
}

interface ConfirmSettings extends GenericInputPromptSettings<boolean> {
    active: string;
    inactive: string;
    keys?: ConfirmKeys;
}

export class Confirm extends GenericInput<boolean, ConfirmSettings> {

    public static async prompt( options: string | ConfirmOptions ): Promise<boolean> {

        if ( typeof options === 'string' ) {
            options = { message: options };
        }

        return new this( {
            active: 'Yes',
            inactive: 'No',
            pointer: blue( Figures.POINTER_SMALL ),
            ...options
        } ).prompt();
    }

    protected getMessage(): string {

        let message = ` ${ yellow( '?' ) } ${ bold( this.settings.message ) } `;

        if ( this.settings.default === true ) {
            message += dim( `(${ this.settings.active[ 0 ].toUpperCase() }/${ this.settings.inactive[ 0 ].toLowerCase() })` );
        } else if ( this.settings.default === false ) {
            message += dim( `(${ this.settings.active[ 0 ].toLowerCase() }/${ this.settings.inactive[ 0 ].toUpperCase() })` );
        } else {
            message += dim( `(${ this.settings.active[ 0 ].toLowerCase() }/${ this.settings.inactive[ 0 ].toLowerCase() })` );
        }

        return message;
    }

    protected validate( value: string ): boolean | string {
        return typeof value === 'string' &&
            [
                this.settings.active[ 0 ].toLowerCase(),
                this.settings.active.toLowerCase(),
                this.settings.inactive[ 0 ].toLowerCase(),
                this.settings.inactive.toLowerCase()
            ].indexOf( value.toLowerCase() ) !== -1;
    }

    protected transform( value: string ): boolean | undefined {
        switch ( value.toLowerCase() ) {
            case this.settings.active[ 0 ].toLowerCase():
            case this.settings.active.toLowerCase():
                return true;
            case this.settings.inactive[ 0 ].toLowerCase():
            case this.settings.inactive.toLowerCase():
                return false;
        }
        return;
    }

    protected format( value: boolean ): string {
        return value ? this.settings.active : this.settings.inactive;
    }
}
