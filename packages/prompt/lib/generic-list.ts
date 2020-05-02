import { GenericPrompt, GenericPromptOptions, GenericPromptSettings } from './generic-prompt.ts';

export interface GenericListItemOptions {
    value: string;
    name?: string;
    disabled?: boolean;
}

export interface GenericListItemSettings extends GenericListItemOptions {
    name: string;
    value: string;
    disabled: boolean;
}

export type GenericListValueOptions = ( string | GenericListItemOptions )[];
export type GenericListValueSettings = GenericListItemSettings[];

export interface GenericListOptions<T, V> extends GenericPromptOptions<T, V> {
    indent?: string;
    listPointer?: string;
    maxRows?: number;
    options: GenericListValueOptions;
}

export interface GenericListSettings<T, V> extends GenericPromptSettings<T, V> {
    indent: string;
    listPointer: string;
    maxRows: number;
    values: GenericListValueSettings;
}

export abstract class GenericList<T, V, S extends GenericListSettings<T, V>> extends GenericPrompt<T, V, S> {

    protected index: number = 0;
    protected selected: number = 0;

    public static separator( label: string = '------------' ): GenericListItemOptions {
        return { value: label, disabled: true };
    }

    protected static mapValues( optValues: GenericListValueOptions ): GenericListItemOptions[] {

        return Object.values( optValues )
                     .map( ( item: string | GenericListItemOptions ) =>
                         typeof item === 'string' ? { value: item } : item );
    }

    protected static mapItem( item: GenericListItemOptions ): GenericListItemSettings {

        return {
            value: item.value,
            name: typeof item.name === 'undefined' ? item.value : item.name,
            disabled: !!item.disabled
        };
    }

    protected setPrompt( message: string ) {

        this.writeLine( message );

        this.writeListItems();
    }

    protected clear() {
        this.screen.eraseLines( this.maxRows() + 2 );
        this.screen.cursorLeft();
        this.screen.eraseDown();
    }

    protected async read(): Promise<boolean> {

        this.screen.cursorHide();

        return super.read();
    }

    protected async selectPrevious(): Promise<void> {

        if ( this.selected > 0 ) {
            this.selected--;
            if ( this.selected < this.index ) {
                this.index--;
            }
            if ( this.settings.values[ this.selected ].disabled ) {
                return this.selectPrevious();
            }
        } else {
            this.selected = this.settings.values.length - 1;
            this.index = this.settings.values.length - this.maxRows();
            if ( this.settings.values[ this.selected ].disabled ) {
                return this.selectPrevious();
            }
        }
    }

    protected async selectNext(): Promise<void> {

        if ( this.selected < this.settings.values.length - 1 ) {
            this.selected++;
            if ( this.selected >= this.index + this.maxRows() ) {
                this.index++;
            }
            if ( this.settings.values[ this.selected ].disabled ) {
                return this.selectNext();
            }
        } else {
            this.selected = this.index = 0;
            if ( this.settings.values[ this.selected ].disabled ) {
                return this.selectNext();
            }
        }
    }

    protected writeListItems() {
        for ( let i = this.index; i < this.index + this.maxRows(); i++ ) {
            this.writeListItem( this.settings.values[ i ], this.selected === i );
        }
    }

    protected abstract writeListItem( item: GenericListItemSettings, isSelected?: boolean ): void;

    protected maxRows() {
        return Math.min( this.settings.values.length, this.settings.maxRows || this.settings.values.length );
    }
}
