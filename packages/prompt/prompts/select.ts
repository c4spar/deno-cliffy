import { blue, dim } from 'https://deno.land/std@0.63.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/lib/key-event.ts';
import { Figures } from '../lib/figures.ts';
import { GenericList, GenericListOption, GenericListOptions, GenericListOptionSettings, GenericListSettings } from '../lib/generic-list.ts';
import { GenericPrompt } from '../lib/generic-prompt.ts';

export interface SelectOption extends GenericListOption {}

export interface SelectOptionSettings extends GenericListOptionSettings {}

export type SelectValueOptions = ( string | SelectOption )[];
export type SelectValueSettings = SelectOptionSettings[];

export interface SelectKeys {
    previous?: string[];
    next?: string[];
    submit?: string[];
}

interface SelectKeysSettings extends Required<SelectKeys> {}

export interface SelectOptions extends GenericListOptions<string, string> {
    keys?: SelectKeys;
}

interface SelectSettings extends GenericListSettings<string, string> {
    keys: SelectKeysSettings;
}

export class Select extends GenericList<string, string, SelectSettings> {

    protected selected: number = typeof this.settings.default !== 'undefined' ? this.settings.options.findIndex( item => item.name === this.settings.default ) || 0 : 0;

    public static inject( value: string ): void {
        GenericPrompt.inject( value );
    }

    public static async prompt( options: SelectOptions ): Promise<string> {

        const items: SelectOption[] = this.mapValues( options.options );
        const values: SelectValueSettings = items.map( item => this.mapItem( item ) );

        return new this( {
            pointer: blue( Figures.POINTER_SMALL ),
            listPointer: blue( Figures.POINTER ),
            indent: ' ',
            maxRows: 10,
            ...options,
            keys: {
                previous: [ 'up', 'u' ],
                next: [ 'down', 'd' ],
                submit: [ 'return', 'enter' ],
                ...( options.keys ?? {} )
            },
            options: values
        } ).prompt();
    }

    protected static mapValues( optValues: SelectValueOptions ): SelectOption[] {
        return super.mapValues( optValues ) as SelectOption[];
    }

    protected static mapItem( item: SelectOption ): SelectOptionSettings {
        return super.mapItem( item ) as SelectOptionSettings;
    }

    protected async handleEvent( event: KeyEvent ): Promise<boolean> {

        switch ( true ) {

            case event.name === 'c':
                if ( event.ctrl ) {
                    this.screen.cursorShow();
                    return Deno.exit( 0 );
                }
                break;

            case this.isKey( this.settings.keys, 'previous', event ):
                await this.selectPrevious();
                break;

            case this.isKey( this.settings.keys, 'next', event ):
                await this.selectNext();
                break;

            case this.isKey( this.settings.keys, 'submit', event ):
                return true;
        }

        return false;
    }

    protected getValue(): string {
        return this.settings.options[ this.selected ].value;
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

    protected validate( value: string ): boolean | string {
        return typeof value === 'string' &&
            value.length > 0 &&
            this.settings.options.findIndex( option => option.value === value ) !== -1;
    }

    protected transform( value: string ): string {
        return value.trim();
    }

    protected format( value: string ): string {
        return this.getOptionByValue( value )?.name ?? value;
    }
}
