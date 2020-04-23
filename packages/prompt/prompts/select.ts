import { blue, dim } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { KeyEvent } from '../../keycode/mod.ts';
import { Figures } from '../lib/figures.ts';
import { PromptModule, PromptModuleOptions } from '../lib/prompt-module.ts';
import { Separator } from '../lib/separator.ts';

export interface SelectPromptOptions extends PromptModuleOptions<string> {
    pointer?: string;
    maxRows?: number;
    values?: ( string | Separator )[] | { [ s: string ]: string | Separator }
}

export interface SelectPromptSettings extends SelectPromptOptions {
    pointer: string;
}

export class Select<O extends SelectPromptOptions, S extends SelectPromptSettings> extends PromptModule<string, O, S> {

    protected index: number = 0;
    protected selected: number = 0;

    public static async prompt( options: SelectPromptOptions ): Promise<string | undefined> {

        return new this( {
            pointer: blue( Figures.POINTER ),
            ...options
        } ).run();
    }

    protected async clear() {
        this.screen.eraseLines( this.maxRows() + 2 );
        this.screen.cursorLeft();
        this.screen.eraseDown();
    }

    public async prompt( index: number = this.selected ): Promise<void> {

        this.selected = index;

        let message = this.settings.message;

        if ( typeof this.settings.default !== 'undefined' ) {
            message += dim( ` (${ this.settings.default })` );
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
                return this.validateValue( this.keys()[ this.selected ] as string );
        }

        return false;
    }

    protected sanitize( value: string ): string {
        return value;
    }

    protected validate( value: string ): boolean {
        return true;
    }

    protected transform( value: string ): string {

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

            this.writeListItem( val, keys[ this.selected ] === key );
        }
    }

    protected writeListItem( val: string | Separator, isSelected?: boolean ) {

        let line: string = '    ';

        if ( val instanceof Separator ) {
            this.writeLine( `${ line }  ${ val.content() }` );
            return;
        }

        line += isSelected ? `${ this.settings.pointer } ` : '  ';

        const value: string = this.transform( val );

        this.writeLine( `${ line }${ isSelected ? value : dim( value ) }` );
    }

    protected keys(): ( string | Separator )[] {
        return Array.isArray( this.settings.values ) ? this.settings.values : Object.keys( this.settings.values as any );
    }

    protected values(): ( string | Separator )[] {
        return Array.isArray( this.settings.values ) ? this.settings.values : Object.values( this.settings.values as any );
    }

    protected length(): number {
        return this.keys().length;
    }

    protected maxRows() {
        return this.settings.maxRows || this.length();
    }
}
