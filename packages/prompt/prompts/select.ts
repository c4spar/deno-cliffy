import { blue, dim } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { Figures } from '../lib/figures.ts';
import { GenericList, GenericListItemOptions, GenericListItemSettings, GenericListNamedItemOptions, GenericListPromptOptions, GenericListPromptSettings } from '../lib/generic-list.ts';

export interface SelectItemOptions extends GenericListItemOptions {
}

export interface SelectNamedItemOptions extends GenericListNamedItemOptions {
}

export interface SelectItemSettings extends GenericListItemSettings {
}

export type SelectValueOptions = ( string | SelectNamedItemOptions )[] | { [ s: string ]: string | SelectItemOptions };
export type SelectValueSettings = SelectItemSettings[];

export interface SelectPromptOptions extends GenericListPromptOptions<string, string> {
    indent?: string;
    pointer?: string;
}

export interface SelectPromptSettings extends GenericListPromptSettings<string, string> {
    indent: string;
    pointer: string;
}

export class Select<S extends SelectPromptSettings> extends GenericList<string, string, S> {

    protected selected: number = typeof this.settings.default !== 'undefined' ? this.settings.values.findIndex( item => item.name === this.settings.default ) || 0 : 0;

    public static async prompt( options: SelectPromptOptions ): Promise<string | undefined> {

        const items: SelectNamedItemOptions[] = this.mapValues( options.values );
        const values: SelectValueSettings = items.map( item => this.mapItem( item ) );

        return new this( {
            pointer: blue( Figures.POINTER ),
            indent: ' ',
            maxRows: 10,
            ...options,
            values
        } ).run();
    }

    public static separator( label: string = '------------' ): SelectNamedItemOptions {
        return super.separator();
    }

    protected static mapValues( optValues: SelectValueOptions ): SelectNamedItemOptions[] {
        return super.mapValues( optValues ) as SelectNamedItemOptions[];
    }

    protected static mapItem( item: SelectNamedItemOptions ): SelectItemSettings {
        return super.mapItem( item ) as SelectItemSettings;
    }

    protected getMessage(): string {

        let message = this.settings.message;

        if ( typeof this.settings.default !== 'undefined' ) {
            message += dim( ` (${ this.settings.default })` );
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

            case 'return':
            case 'enter':
                return this.selectValue();
        }

        return false;
    }

    protected async selectValue() {
        return this.validateValue( this.settings.values[ this.selected ].name );
    }

    protected writeListItem( item: SelectItemSettings, isSelected?: boolean ) {

        let line = this.settings.indent;

        // pointer
        line += isSelected ? `${ this.settings.pointer } ` : '  ';

        // value
        const value: string = item.label;
        line += `${ isSelected ? value : dim( value ) }`;

        this.writeLine( line );
    }

    protected sanitize( value: string ): string {
        return value;
    }

    protected validate( value: string ): boolean {
        return true;
    }

    protected transform( value: string ): string {
        return value;
    }
}
