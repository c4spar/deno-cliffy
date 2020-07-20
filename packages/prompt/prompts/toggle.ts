import { blue, dim, underline } from 'https://deno.land/std@v0.61.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { Figures } from '../lib/figures.ts';
import { GenericPrompt, GenericPromptOptions, GenericPromptSettings } from '../lib/generic-prompt.ts';

export interface ToggleOptions extends GenericPromptOptions<boolean, string> {
    active?: string;
    inactive?: string;
}

export interface ToggleSettings extends GenericPromptSettings<boolean, string> {
    active: string;
    inactive: string;
}

export class Toggle extends GenericPrompt<boolean, string, ToggleSettings> {

    protected status: string = typeof this.settings.default !== 'undefined' ? this.format( this.settings.default ) : '';

    public static async prompt( options: string | ToggleOptions ): Promise<boolean> {

        if ( typeof options === 'string' ) {
            options = { message: options };
        }

        return new this( {
            pointer: blue( Figures.POINTER_SMALL ),
            active: 'Yes',
            inactive: 'No',
            ...options
        } ).prompt();
    }

    protected setPrompt( message: string ) {

        message += ` ${ this.settings.pointer } `;

        if ( this.status === this.settings.active ) {
            message += `${ dim( `${ this.settings.inactive } /` ) } ${ underline( this.settings.active ) }`;
        } else if ( this.status === this.settings.inactive ) {
            message += `${ underline( this.settings.inactive ) } ${ dim( `/ ${ this.settings.active }` ) }`;
        } else {
            message += dim( `${ this.settings.inactive } / ${ this.settings.active }` );
        }

        this.write( message );
    }

    protected async read(): Promise<boolean> {

        this.screen.cursorHide();

        return super.read();
    }

    protected async handleEvent( event: KeyEvent ): Promise<boolean> {

        switch ( event.name ) {

            case 'c':
                if ( event.ctrl ) {
                    return Deno.exit( 0 );
                }
                break;

            case this.settings.inactive[ 0 ].toLowerCase():
            case 'n': // no nein non
            case 'left':
                this.selectInactive();
                break;

            case this.settings.active[ 0 ].toLowerCase():
            case 'y': // yes
            case 'j': // ja
            case 's': // si
            case 'o': // oui
            case 'right':
                this.selectActive();
                break;

            case 'return':
            case 'enter':
                return true;
        }

        return false;
    }

    protected selectActive() {
        this.status = this.settings.active;
    }

    protected selectInactive() {
        this.status = this.settings.inactive;
    }

    protected validate( value: string ): boolean | string {
        return [ this.settings.active, this.settings.inactive ].indexOf( value ) !== -1;
    }

    protected transform( value: string ): boolean | undefined {
        switch ( value ) {
            case this.settings.active:
                return true;
            case this.settings.inactive:
                return false;
        }
        return;
    }

    protected format( value: boolean ): string {
        return value ? this.settings.active : this.settings.inactive;
    }

    protected getValue(): string {
        return this.status;
    }
}
