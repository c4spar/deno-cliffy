import { encode } from 'https://deno.land/std@v0.61.0/encoding/utf8.ts';
import { border, IBorder } from './border.ts';
import { Cell, ICell } from './cell.ts';
import { CELL_PADDING, MAX_CELL_WIDTH, MIN_CELL_WIDTH } from './const.ts';
import { IRow, Row } from './row.ts';
import { consumeWords, longest, stripeColors } from './utils.ts';

export type IBorderOptions = Partial<IBorder>;

export interface ITableOptions {
    indent?: number;
    border?: boolean;
    maxCellWidth?: number | number[];
    minCellWidth?: number | number[];
    padding?: number | number[];
    chars?: IBorderOptions;
}

interface ITableSettings extends Required<ITableOptions> {
    chars: IBorder;
}

export type ITable<T extends IRow = IRow> = T[] | Table<T>;

interface ICalc {
    padding: number[],
    width: number[],
    columns: number
}

export class Table<T extends IRow = IRow> extends Array<T> {

    protected options: ITableSettings = {
        padding: 0,
        chars: border,
        border: false,
        indent: 0,
        maxCellWidth: Infinity,
        minCellWidth: 0
    };

    public static from<T extends IRow>( rows: ITable<T> ): Table<T> {
        const table = new this( ...rows );
        if ( rows instanceof Table ) {
            table.options = Object.assign( {}, rows.options );
        }
        return table;
    }

    public static render<T extends IRow>( rows: ITable<T> ): void {
        Table.from( rows ).render();
    }

    public body( rows: T[] ): this {
        this.length = 0;
        this.push( ...rows );
        return this;
    }

    public render(): void {
        Deno.stdout.writeSync( encode( this.toString() ) );
    }

    public clone(): Table {
        const table = new Table( ...this.map( ( row: T ) =>
            row instanceof Row ? row.clone() : Row.from( row ).clone() ) );
        table.options = Object.assign( {}, this.options );
        return table;
    }

    /**
     * Calc:
     */

    protected calc(): ICalc {

        const padding: number[] = [];
        const width: number[] = [];

        const columns: number = Math.max( ...this.map( row => Object.keys( row ).length ) );

        for ( let colIndex: number = 0; colIndex < columns; colIndex++ ) {


            let minCellWidth: number = Array.isArray( this.options.minCellWidth ) ? this.options.minCellWidth[ colIndex ] :
                ( typeof this.options.minCellWidth === 'undefined' ? MIN_CELL_WIDTH : this.options.minCellWidth );

            let maxCellWidth: number = Array.isArray( this.options.maxCellWidth ) ? this.options.maxCellWidth[ colIndex ] :
                ( typeof this.options.maxCellWidth === 'undefined' ? MAX_CELL_WIDTH : this.options.maxCellWidth );

            padding[ colIndex ] = Array.isArray( this.options.padding ) ? this.options.padding[ colIndex ] :
                ( typeof this.options.padding === 'undefined' ? CELL_PADDING : this.options.padding );

            let cellWidth: number = longest( colIndex, this, maxCellWidth );
            // let cellWidth: number = longest( colIndex, this );
            width[ colIndex ] = Math.min( maxCellWidth, Math.max( minCellWidth, cellWidth ) );
        }

        return { padding, width, columns };
    }

    protected getRows(): Row<Cell>[] {

        return this.map( ( iRow: T ) => {

            const row: Row = Row.from( iRow );

            if ( this.options.border ) {
                row.border( this.options.border, false );
            }

            row.forEach( ( iCell: ICell, i: number ) => {
                const cell = Cell.from( iCell );
                if ( row.getBorder() ) {
                    cell.border( row.getBorder() as boolean, false );
                }
                row[ i ] = cell;
            } );

            return row as Row<Cell>;
        } );
    }

    /**
     * Render:
     */

    public toString(): string {

        const calc: ICalc = this.calc();
        const rows: Row<Cell>[] = this.getRows();

        return this.renderRows( calc, rows );
    }

    protected renderRows( opts: ICalc, rows: Row<Cell>[], _rowGroupIndex: number = 0 ) {

        let result: string = '';

        result += this.renderRow( rows[ _rowGroupIndex ], rows[ _rowGroupIndex - 1 ], rows[ _rowGroupIndex + 1 ], opts, _rowGroupIndex );

        if ( _rowGroupIndex < this.length - 1 ) {
            result += this.renderRows( opts, rows, ++_rowGroupIndex );
        }

        return result;
    }

    protected renderRow( row: Row<Cell>, prevRow: Row<Cell> | undefined, nextRow: Row<Cell> | undefined, opts: ICalc, _rowGroupIndex: number = 0, _rowIndex: number = 0 ): string {

        let result: string = '';

        if ( row.getBorder() && _rowGroupIndex === 0 && _rowIndex === 0 ) {
            result += this.renderBorderTopRow( row, prevRow, nextRow, opts );
        }

        const { cells, isMultilineRow } = this.renderCells( row, opts );

        result += cells;

        if ( isMultilineRow ) {
            result += this.renderRow( row, prevRow, nextRow, opts, _rowGroupIndex, ++_rowIndex );
        } else if ( _rowGroupIndex < this.length - 1 ) {
            if ( row.getBorder() ) {
                result += this.renderBorderMidRow( row, prevRow, nextRow, opts );
            }
        } else if ( _rowGroupIndex === this.length - 1 ) {
            if ( row.getBorder() ) {
                result += this.renderBorderBottomRow( row, prevRow, nextRow, opts );
            }
        } else {
            throw new Error( `Invalid row index: ${ _rowGroupIndex }` );
        }

        return result;
    }

    protected renderCells( row: Row<Cell>, opts: ICalc ) {

        let cells: string = ' '.repeat( this.options.indent || 0 );
        let isMultilineRow: boolean = false;

        const rowCount = row.length;
        let prev: Cell | undefined;

        for ( let i = 0; i < rowCount; i++ ) {

            const cell: Cell = row[ i ];

            if ( i === 0 ) {
                if ( cell.getBorder() ) {
                    cells += this.options.chars.left;
                } else {
                    // cells += ' ';
                }
            }

            const { current, next } = this.renderCell( cell, opts.width[ i ] );

            // it's required to call explicilty .length because next is a String class and not a string type.
            next.length && ( isMultilineRow = true );
            row[ i ] = next;

            if ( i > 0 ) {
                if ( cell.getBorder() && ( !prev || prev.getBorder() ) ) {
                    cells += this.options.chars.middle;
                } else {
                    // cells += ' ';
                }
            }

            if ( cell.getBorder() ) {
                cells += ' '.repeat( opts.padding[ i ] );
            }

            cells += current;

            if ( cell.getBorder() || i < rowCount - 1 ) {
                cells += ' '.repeat( opts.padding[ i ] );
            }

            if ( i === rowCount - 1 ) {
                if ( cell.getBorder() ) {
                    cells += this.options.chars.right;
                } else {
                    // cells += ' ';
                }
            }

            prev = cell;
        }


        cells += '\n';

        return { cells, isMultilineRow };
    }

    protected renderCell( cell: Cell, maxLength: number ): { current: string, next: Cell } {

        const length: number = Math.min( maxLength, stripeColors( cell.toString() ).length );
        let words: string = consumeWords( length, cell.toString() );

        // break word if word is longer than max length
        const breakWord = stripeColors( words ).length > length;
        if ( breakWord ) {
            words = words.slice( 0, length );
        }

        // get next content and remove leading space if breakWord is not true
        const next = cell.slice( words.length + ( breakWord ? 0 : 1 ) );
        const fillLength = maxLength - stripeColors( words ).length;
        const current = words + ' '.repeat( fillLength );

        return {
            current,
            next: cell.clone( next )
        };
    }

    /**
     * Border:
     */

    protected renderBorderTopRow( row: Row<Cell>, prevRow: Row<Cell> | undefined, nextRow: Row<Cell> | undefined, opts: ICalc ): string {

        let cells = [];

        for ( let i = 0; i < opts.columns; i++ ) {
            const cell: Cell = row[ i ];
            cells.push( ( cell.getBorder() ? this.options.chars.top : ' ' ).repeat( opts.padding[ i ] + opts.width[ i ] + opts.padding[ i ] ) );
        }

        return ' '.repeat( this.options.indent || 0 ) + this.options.chars.topLeft + cells.join( this.options.chars.topMid ) + ( this.options.chars.topRight ) + '\n';
    }

    protected renderBorderMidRow( row: Row<Cell>, prevRow: Row<Cell> | undefined, nextRow: Row<Cell> | undefined, opts: ICalc ): string {

        let cells = [];

        for ( let i = 0; i < opts.columns; i++ ) {
            const cell: Cell = row[ i ];
            const nextCell = nextRow && nextRow[ i ];
            cells.push( ( cell.getBorder() && nextCell?.getBorder() !== false ? this.options.chars.mid : ' ' ).repeat( opts.padding[ i ] + opts.width[ i ] + opts.padding[ i ] ) );
        }

        return ' '.repeat( this.options.indent || 0 ) + this.options.chars.leftMid + cells.join( this.options.chars.midMid ) + ( this.options.chars.rightMid ) + '\n';
    }

    protected renderBorderBottomRow( row: Row<Cell>, prevRow: Row<Cell> | undefined, nextRow: Row<Cell> | undefined, opts: ICalc ): string {

        let cells = [];

        for ( let i = 0; i < opts.columns; i++ ) {
            const cell: Cell = row[ i ];
            cells.push( ( cell.getBorder() ? this.options.chars.bottom : ' ' ).repeat( opts.padding[ i ] + opts.width[ i ] + opts.padding[ i ] ) );
        }

        return ' '.repeat( this.options.indent || 0 ) + this.options.chars.bottomLeft + cells.join( this.options.chars.bottomMid ) + ( this.options.chars.bottomRight ) + '\n';
    }

    /**
     * Setter:
     */

    public indent( width: number, override: boolean = true ): this {
        if ( override || typeof this.options.indent === 'undefined' ) {
            this.options.indent = width;
        }
        return this;
    }

    public maxCellWidth( width: number | number[], override: boolean = true ): this {
        if ( override || typeof this.options.maxCellWidth === 'undefined' ) {
            this.options.maxCellWidth = width;
        }
        return this;
    }

    public minCellWidth( width: number | number[], override: boolean = true ): this {
        if ( override || typeof this.options.minCellWidth === 'undefined' ) {
            this.options.minCellWidth = width;
        }
        return this;
    }

    public padding( padding: number | number[], override: boolean = true ): this {
        if ( override || typeof this.options.padding === 'undefined' ) {
            this.options.padding = padding;
        }
        return this;
    }

    public border( enable: boolean, override: boolean = true ): this {
        if ( override || typeof this.options.border === 'undefined' ) {
            this.options.border = enable;
        }
        return this;
    }

    public chars( chars: IBorderOptions ): this {
        Object.assign( this.options.chars, chars );
        return this;
    }

    /**
     * Getter:
     */

    public getIndent( defaultValue?: number ): number | undefined {
        return this.options.indent ?? defaultValue;
    }

    public getMaxCellWidth( defaultValue?: number | number[] ): number | number[] | undefined {
        return this.options.maxCellWidth ?? defaultValue;
    }

    public getMinCellWidth( defaultValue?: number | number[] ): number | number[] | undefined {
        return this.options.minCellWidth ?? defaultValue;
    }

    public getPadding( defaultValue?: number | number[] ): number | number[] | undefined {
        return this.options.padding ?? defaultValue;
    }

    public getBorder( defaultValue?: boolean ): boolean | undefined {
        return this.options.border ?? defaultValue;
    }
}
