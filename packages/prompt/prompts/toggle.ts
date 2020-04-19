import { bold, dim, underline, yellow } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { GenericInput, GenericInputPromptOptions } from './generic-input.ts';

export interface TogglePromptOptions extends GenericInputPromptOptions<boolean> {
    active?: string;
    inactive?: string;
}

export interface TogglePromptSettings extends TogglePromptOptions {
    active: string;
    inactive: string;
}

export class Toggle extends GenericInput<boolean, TogglePromptOptions, TogglePromptSettings> {

    public static async prompt( options: TogglePromptOptions ): Promise<boolean | undefined> {

        return new this( {
            active: 'Yes',
            inactive: 'No',
            ...options
        } ).run();
    }

    public prompt(): void {

        let message = ` ${ yellow( '?' ) } ${ bold( this.settings.message ) } ${ this.settings.pointer } `;

        if ( this.input === this.settings.active ) {
            message += `${ dim( `${ this.settings.inactive } /` ) } ${ underline( this.settings.active ) }`;
        } else if ( this.input === this.settings.inactive ) {
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
        this.input = this.settings.active;
    }

    protected selectNo() {
        this.input = this.settings.inactive;
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
