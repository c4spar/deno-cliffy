import { blue, dim } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { Figures } from '../lib/figures.ts';
import { GenericList, GenericListItemOptions, GenericListItemSettings, GenericListOptions, GenericListSettings } from '../lib/generic-list.ts';

export interface SelectItemOptions extends GenericListItemOptions {
}

export interface SelectItemSettings extends GenericListItemSettings {
}

export type SelectValueOptions = ( string | SelectItemOptions )[];
export type SelectValueSettings = SelectItemSettings[];

export interface SelectOptions extends GenericListOptions<string, string> {}

export interface SelectSettings extends GenericListSettings<string, string> {}

export class Select<S extends SelectSettings> extends GenericList<string, string, S> {

    protected selected: number = typeof this.settings.default !== 'undefined' ? this.settings.values.findIndex( item => item.name === this.settings.default ) || 0 : 0;

    public static async prompt( options: SelectOptions ): Promise<string | undefined> {

        const items: SelectItemOptions[] = this.mapValues( options.options );
        const values: SelectValueSettings = items.map( item => this.mapItem( item ) );

        return new this( {
            pointer: blue( Figures.POINTER_SMALL ),
            listPointer: blue( Figures.POINTER ),
            indent: ' ',
            maxRows: 10,
            ...options,
            values
        } ).prompt();
    }

    protected static mapValues( optValues: SelectValueOptions ): SelectItemOptions[] {
        return super.mapValues( optValues ) as SelectItemOptions[];
    }

    protected static mapItem( item: SelectItemOptions ): SelectItemSettings {
        return super.mapItem( item ) as SelectItemSettings;
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
                this.writeLine();
                return this.selectValue();
        }

        return false;
    }

    protected async selectValue() {
        return this.validateValue( this.settings.values[ this.selected ].value );
    }

    protected writeListItem( item: SelectItemSettings, isSelected?: boolean ) {

        let line = this.settings.indent;

        // pointer
        line += isSelected ? `${ this.settings.listPointer } ` : '  ';

        // value
        const value: string = item.name;
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
