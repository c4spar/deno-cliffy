import { dim, green, red } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/mod.ts';
import { Figures } from '../lib/figures.ts';
import { Separator } from '../lib/separator.ts';
import { Select, SelectPromptOptions } from './select.ts';

export interface CheckboxPromptOptions extends SelectPromptOptions {
    check?: string;
    uncheck?: string;
}

export class Checkbox extends Select<CheckboxPromptOptions> {

    public static async prompt( options: CheckboxPromptOptions ): Promise<string | undefined> {

        return new this( options ).run();
    }

    protected checked: string[] = [];


    constructor( options: CheckboxPromptOptions ) {
        super( {
            check: green( Figures.TICK ),
            uncheck: red( Figures.CROSS ),
            ...options
        } );
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
        const index = typeof selected === 'string' ? this.checked.indexOf( selected ) : -1;

        if ( index === -1 ) {
            this.checked.push( <string>selected );
        } else {
            this.checked.splice( index, 1 );
        }
    }

    protected async selectValue() {

        const promises = this.checked.map( checked => this.validateValue( checked ) );
        const result = await Promise.all( promises );
        const isValid: boolean = result.every( isValid => isValid );

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
            const isChecked: boolean = this.checked.indexOf( key ) !== -1;

            this.writeListItem( val, isSelected, isChecked );
        }
    }

    protected writeListItem( val: string | Separator, isSelected?: boolean, isChecked?: boolean ) {

        let line = '    ';

        if ( val instanceof Separator ) {
            this.writeLine( `${ line }  ${ val.content() }` );
            return;
        }

        line += isSelected ? `${ this.options.pointer } ` : '  ';
        line += isChecked ? `${ this.options.check } ` : `${ this.options.uncheck } `;

        const value = this.transform( val );

        this.writeLine( `${ line }${ isSelected ? value : dim( value ) }` );
    }
}
