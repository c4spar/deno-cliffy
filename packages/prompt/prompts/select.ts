import { blue, dim } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { Figures } from '../lib/figures.ts';
import { GenericList, GenericListOption, GenericListOptions, GenericListOptionSettings, GenericListSettings } from '../lib/generic-list.ts';

export interface SelectOption extends GenericListOption {}

export interface SelectOptionSettings extends GenericListOptionSettings {}

export type SelectValueOptions = ( string | SelectOption )[];
export type SelectValueSettings = SelectOptionSettings[];

export interface SelectOptions extends GenericListOptions<string, string> {}

export interface SelectSettings extends GenericListSettings<string, string> {}

export class Select<S extends SelectSettings> extends GenericList<string, string, S> {

    protected selected: number = typeof this.settings.default !== 'undefined' ? this.settings.values.findIndex( item => item.name === this.settings.default ) || 0 : 0;

    public static async prompt( options: SelectOptions ): Promise<string | undefined> {

        const items: SelectOption[] = this.mapValues( options.options );
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

    protected static mapValues( optValues: SelectValueOptions ): SelectOption[] {
        return super.mapValues( optValues ) as SelectOption[];
    }

    protected static mapItem( item: SelectOption ): SelectOptionSettings {
        return super.mapItem( item ) as SelectOptionSettings;
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
        return this.validateValue( this.settings.values[ this.selected ].value );
    }

    protected writeListItem( item: SelectOptionSettings, isSelected?: boolean ) {

        let line = this.settings.indent;

        // pointer
        line += isSelected ? `${ this.settings.listPointer } ` : '  ';

        // value
        const value: string = item.name;
        line += `${ isSelected ? value : dim( value ) }`;

        this.writeLine( line );
    }

    protected transform( value: string ): string {
        return value;
    }

    protected validate( value: string ): boolean {
        return true;
    }

    protected format( value: string ): string {
        return value;
    }
}
