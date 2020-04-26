import { blue, dim, green, red } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/mod.ts';
import { Figures } from '../lib/figures.ts';
import { GenericList, GenericListItemOptions, GenericListItemSettings, GenericListNamedItemOptions, GenericListPromptOptions, GenericListPromptSettings } from './generic-list.ts';

export interface CheckboxItemOptions extends GenericListItemOptions {
    checked?: boolean;
    icon?: boolean;
}

export interface CheckboxNamedItemOptions extends GenericListNamedItemOptions {
    checked?: boolean;
    icon?: boolean;
}

export interface CheckboxItemSettings extends GenericListItemSettings {
    checked: boolean;
    icon: boolean;
}

export type CheckboxValueOptions =
    ( string | CheckboxNamedItemOptions )[]
    | { [ s: string ]: string | CheckboxItemOptions };
export type CheckboxValueSettings = CheckboxItemSettings[];

export interface CheckboxPromptOptions extends GenericListPromptOptions<string[], string[]> {
    indent?: string;
    pointer?: string;
    check?: string;
    uncheck?: string;
    values: CheckboxValueOptions;
}

export interface CheckboxPromptSettings extends GenericListPromptSettings<string[], string[]> {
    indent: string;
    pointer: string;
    check: string;
    uncheck: string;
    values: CheckboxValueSettings;
}

export class Checkbox extends GenericList<string[], string[], CheckboxPromptSettings> {

    public static async prompt( options: CheckboxPromptOptions ): Promise<string[] | undefined> {

        const items: CheckboxNamedItemOptions[] = this.mapValues( options.values );
        const values: CheckboxValueSettings = items.map( item => this.mapItem( item, options.default ) );

        return new this( {
            pointer: blue( Figures.POINTER ),
            indent: ' ',
            maxRows: 0,
            check: green( Figures.TICK ),
            uncheck: red( Figures.CROSS ),
            ...options,
            values
        } ).run();
    }

    public static separator( label: string = '------------' ): CheckboxNamedItemOptions {
        return {
            ...super.separator(),
            icon: false
        };
    }

    protected static mapValues( optValues: CheckboxValueOptions ): CheckboxNamedItemOptions[] {
        return super.mapValues( optValues ) as CheckboxNamedItemOptions[];
    }

    protected static mapItem( item: CheckboxNamedItemOptions, defaults?: string[] ): CheckboxItemSettings {
        return {
            ...super.mapItem( item ),
            checked: typeof item.checked === 'undefined' && defaults && defaults.indexOf( item.name ) !== -1 ? true : !!item.checked,
            icon: typeof item.icon === 'undefined' ? true : item.icon
        };
    }

    protected getMessage(): string {

        let message = this.settings.message;

        if ( typeof this.settings.default !== 'undefined' ) {
            message += dim( ` (${ this.settings.default.join( ', ' ) })` );
        }

        return message;
    }

    protected async handleEvent( event: KeyEvent ): Promise<boolean> {

        switch ( event.name ) {

            case 'c':
                if ( event.ctrl ) {
                    return Deno.exit( 0 );
                }
                break;

            case 'up':
                await this.selectPrevious();
                break;

            case 'down':
                await this.selectNext();
                break;

            case 'space':
                this.checkValue();
                break;

            case 'return':
            case 'enter':
                return this.selectValue();
        }

        return false;
    }

    protected checkValue() {
        const item = this.settings.values[ this.selected ];
        item.checked = !item.checked;
    }

    protected values() {
        return this.settings.values
                   .filter( item => item.checked )
                   .map( item => item.name );
    }

    protected async selectValue() {
        return this.validateValue( this.values() );
    }

    protected writeListItem( item: CheckboxItemSettings, isSelected?: boolean ) {

        let line = this.settings.indent;

        // pointer
        line += isSelected ? `${ this.settings.pointer } ` : '  ';

        // icon
        if ( item.icon ) {
            let check = item.checked ? `${ this.settings.check } ` : `${ this.settings.uncheck } `;
            if ( item.disabled ) {
                check = dim( check );
            }
            line += check;
        } else {
            line += '  ';
        }

        // value
        const value: string = item.label;
        line += `${ isSelected ? value : dim( value ) }`;

        this.writeLine( line );
    }

    protected sanitize( value: string[] ): string[] {
        return value;
    }

    protected validate( value: string[] ): boolean {
        return true;
    }

    protected transform( value: string[] ): string {
        return value.map( val => val.slice( 0, 1 ).toUpperCase() + val.slice( 1 ) )
                    .join( ' ' );
    }
}
