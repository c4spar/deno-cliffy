import { encode } from 'https://deno.land/std@v0.52.0/encoding/utf8.ts';
import { blue, green, underline } from 'https://deno.land/std@v0.52.0/fmt/colors.ts';
import { stripeColors } from '../../table/lib/utils.ts';
import { Figures } from '../lib/figures.ts';
import { GenericInput, GenericInputPromptOptions, GenericInputPromptSettings } from '../lib/generic-input.ts';

export interface SecretOptions extends GenericInputPromptOptions<string> {
    hidden?: boolean;
}

export interface SecretSettings extends GenericInputPromptSettings<string> {
    hidden: boolean;
}

export class Secret extends GenericInput<string, SecretSettings> {

    public static async prompt( options: string | SecretOptions ): Promise<string> {

        if ( typeof options === 'string' ) {
            options = { message: options };
        }

        return new this( {
            pointer: blue( Figures.POINTER_SMALL ),
            hidden: false,
            ...options
        } ).prompt();
    }

    protected setPrompt( message: string ) {

        this.screen.cursorHide();

        message += ' ' + this.settings.pointer + ' ';

        const length = encode( stripeColors( message ) ).length;

        const secret = this.settings.hidden ? '' : '*'.repeat( this.input.length );

        message += underline( secret );

        this.write( message );

        this.screen.cursorTo( length - 1 + this.index );
    }

    protected async getSuccessMessage( value: string ) {
        value = this.settings.hidden ? '*'.repeat( 8 ) : '*'.repeat( value.length );
        return `${ await this.getMessage() } ${ this.settings.pointer } ${ green( value ) }`;
    }

    protected validate( value: string ): boolean {
        return typeof value === 'string' && value.length > 0;
    }

    protected transform( value: string ): string | undefined {
        return value;
    }

    protected format( value: string ): string {
        return value;
    }
}
