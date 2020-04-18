import { blue, dim } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/mod.ts';
import { Figures } from '../lib/figures.ts';
import { PromptModule } from '../lib/prompt-module.ts';
import { Separator } from '../lib/separator.ts';
import { PromptModuleOptions } from '../lib/types.ts';

export interface SelectPromptOptions extends PromptModuleOptions<string> {
    pointer?: string;
    maxRows?: number;
    values?: ( string | Separator )[] | { [ s: string ]: string | Separator }
}

export class Select<O extends SelectPromptOptions> extends PromptModule<string, O> {

    protected index: number = 0;
    protected selected: number = 0;

    public static async prompt( options: SelectPromptOptions ): Promise<string | undefined> {

        return new this( options ).run();
    }

    constructor( options: O ) {
        super( {
            pointer: blue( Figures.POINTER ),
            ...options
        } );
    }

    protected async clear() {
        this.screen.eraseLines( this.maxRows() + 2 );
        this.screen.cursorLeft();
        this.screen.eraseDown();
    }

    public async prompt( index: number = this.selected ): Promise<void> {

        this.selected = index;

        let message = this.options.message;

        if ( this.options.default ) {
            message += dim( ` (${ this.options.default })` );
        }

        this.question( message, true );

        this.writeListItems();
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

            case 'up':
                await this.selectPrevious();
                break;

            case 'down':
                await this.selectNext();
                break;

            case 'return':
            case 'enter':
                return this.validateValue( <string>this.keys()[ this.selected ] );
        }

        return false;
    }

    protected sanitize( value: string ): string {
        return value;
    }

    protected validate( value: string ): boolean {
        return true;
    }

    protected transform( value: string ): any {

        return value.split( ' ' )
                    .map( val => val.slice( 0, 1 ).toUpperCase() + val.slice( 1 ) )
                    .join( ' ' );
    }

    protected async selectPrevious(): Promise<void> {

        if ( this.selected > 0 ) {

            this.selected--;

            if ( this.selected < this.index ) {
                this.index--;
            }

            if ( this.values()[ this.selected ] instanceof Separator ) {
                return this.selectPrevious();
            }
        } else {

            this.selected = this.length() - 1;
            this.index = this.length() - this.maxRows();

            if ( this.values()[ this.selected ] instanceof Separator ) {
                return this.selectPrevious();
            }
        }
    }

    protected async selectNext(): Promise<void> {

        if ( this.selected < this.length() - 1 ) {

            this.selected++;

            if ( this.selected >= this.index + this.maxRows() ) {
                this.index++;
            }

            if ( this.values()[ this.selected ] instanceof Separator ) {
                return this.selectNext();
            }
        } else {

            this.selected = this.index = 0;

            if ( this.values()[ this.selected ] instanceof Separator ) {
                return this.selectNext();
            }
        }
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

            this.writeListItem( val, isSelected );
        }
    }

    protected writeListItem( val: string | Separator, isSelected?: boolean ) {

        let line: string = '    ';

        if ( val instanceof Separator ) {
            this.writeLine( `${ line }  ${ val.content() }` );
            return;
        }

        line += isSelected ? `${ this.options.pointer } ` : '  ';

        const value = this.transform( val );

        this.writeLine( `${ line }${ isSelected ? value : dim( value ) }` );
    }

    protected keys(): ( string | Separator )[] {
        return Array.isArray( this.options.values ) ? this.options.values : Object.keys( this.options.values as any );
    }

    protected values(): ( string | Separator )[] {
        return Array.isArray( this.options.values ) ? this.options.values : Object.values( this.options.values as any );
    }

    protected length(): number {
        return this.keys().length;
    }

    protected maxRows() {
        return this.options.maxRows || this.length();
    }
}
