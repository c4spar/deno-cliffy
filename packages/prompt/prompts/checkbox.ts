import { blue, dim, green, red } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/mod.ts';
import { Figures } from '../lib/figures.ts';
import { Separator } from '../lib/separator.ts';
import { Select, SelectPromptOptions } from './select.ts';

export interface CheckboxPromptOptions extends SelectPromptOptions {
    check?: string;
    uncheck?: string;
    checked?: string[];
}

export interface CheckboxPromptSettings extends CheckboxPromptOptions {
    pointer: string;
    check: string;
    uncheck: string;
    checked: string[];
}

export class Checkbox extends Select<CheckboxPromptOptions, CheckboxPromptSettings> {

    public static async prompt( options: CheckboxPromptOptions ): Promise<string | undefined> {

        return new this( {
            pointer: blue( Figures.POINTER ),
            check: green( Figures.TICK ),
            uncheck: red( Figures.CROSS ),
            checked: [],
            ...options
        } ).run();
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

        const keys: ( string | Separator )[] = this.keys();
        const selected: string | Separator = keys[ this.selected ];
        const index = typeof selected === 'string' ? this.settings.checked.indexOf( selected ) : -1;

        if ( index === -1 ) {
            this.settings.checked.push( <string>selected );
        } else {
            this.settings.checked.splice( index, 1 );
        }
    }

    protected async selectValue() {

        const promises = this.settings.checked.map( ( checked: string ) => this.validateValue( checked ) );
        const result: boolean[] = await Promise.all( promises );
        const isValid: boolean = result.every( ( isValid: boolean ) => isValid );

        return isValid;
    }

    protected writeListItems() {

        const keys: ( string | Separator )[] = this.keys();
        const values: ( string | Separator )[] = this.values();

        for ( let i = this.index; i < this.index + this.maxRows(); i++ ) {

            const key: string | Separator = keys[ i ];
            const val: string | Separator = values[ i ];

            if ( key instanceof Separator ) {
                this.writeListItem( val );
                continue;
            }

            const isSelected: boolean = keys[ this.selected ] === key;
            const isChecked: boolean = this.settings.checked.indexOf( key ) !== -1;

            this.writeListItem( val, isSelected, isChecked );
        }
    }

    protected writeListItem( val: string | Separator, isSelected?: boolean, isChecked?: boolean ) {

        let line = '    ';

        if ( val instanceof Separator ) {
            this.writeLine( `${ line }  ${ val.content() }` );
            return;
        }

        line += isSelected ? `${ this.settings.pointer } ` : '  ';
        line += isChecked ? `${ this.settings.check } ` : `${ this.settings.uncheck } `;

        const value: string = this.transform( val );

        this.writeLine( `${ line }${ isSelected ? value : dim( value ) }` );
    }
}
