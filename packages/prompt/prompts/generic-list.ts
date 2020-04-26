import camelCase from '../../x/camelCase.ts';
import { GenericPrompt, GenericPromptOptions, GenericPromptSettings } from '../lib/generic-prompt.ts';

export interface GenericListItemOptions {
    label?: string;
    disabled?: boolean;
}

export interface GenericListNamedItemOptions extends GenericListItemOptions {
    name: string;
    label?: string;
    disabled?: boolean;
}

export interface GenericListItemSettings extends GenericListNamedItemOptions {
    name: string;
    label: string;
    disabled: boolean;
}

export type GenericListValueOptions =
    ( string | GenericListNamedItemOptions )[]
    | { [ s: string ]: string | GenericListItemOptions };
export type GenericListValueSettings = GenericListItemSettings[];

export interface GenericListPromptOptions<T, V> extends GenericPromptOptions<T, V> {
    maxRows?: number;
    values: GenericListValueOptions;
}

export interface GenericListPromptSettings<T, V> extends GenericPromptSettings<T, V> {
    maxRows: number;
    values: GenericListValueSettings;
}

export abstract class GenericList<T, V, S extends GenericListPromptSettings<T, V>> extends GenericPrompt<T, V, S> {

    protected index: number = 0;
    protected selected: number = 0;

    public static separator( label: string = '------------' ): GenericListNamedItemOptions {
        return { name: label, label, disabled: true };
    }

    protected static mapValues( optValues: GenericListValueOptions ): GenericListNamedItemOptions[] {

        if ( Array.isArray( optValues ) ) {
            return Object.values( optValues )
                         .map( ( item: string | GenericListNamedItemOptions ) =>
                             typeof item === 'string' ? { name: item } : item );
        }

        return Object.keys( optValues )
                     .map( ( name: string ) => {
                         const item: string | GenericListItemOptions = optValues[ name ];
                         return typeof item === 'string' ? { name, label: item } : { name, ...item };
                     } );
    }

    protected static mapItem( item: GenericListNamedItemOptions ): GenericListItemSettings {

        return {
            name: camelCase( item.name ),
            label: item.label || item.name,
            disabled: !!item.disabled
        };
    }

    protected setMessage( message: string ) {

        this.question( message, true );

        this.writeListItems();
    }

    protected async clear() {
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
        return this.settings.maxRows || this.settings.values.length;
    }
}
