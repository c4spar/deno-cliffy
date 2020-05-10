import { encode } from 'https://deno.land/std@v0.50.0/encoding/utf8.ts';
import { border } from './border.ts';
import { Cell, ICell } from './cell.ts';
import { CELL_PADDING, MAX_CELL_WIDTH, MIN_CELL_WIDTH } from './const.ts';
import { IRow, Row } from './row.ts';
import { consumeWords, longest, stripeColors } from './utils.ts';

export interface ITableOptions {
    indent?: number;
    border?: boolean;
    maxCellWidth?: number | number[];
    minCellWidth?: number | number[];
    padding?: number | number[];
}

export type ITable = IRow[] | Table;

export interface ICalc {
    padding: number[],
    width: number[],
    columns: number
}

export class Table extends Array<IRow> {

    protected options: ITableOptions = {};

    public static from( rows: ITable ): Table {
        const table = new Table( ...rows.map( cells => [ ...cells ] ) );
        if ( rows instanceof Table ) {
            table.options = Object.create( rows.options );
        }
        return table;
    }

    public static render( rows: ITable ): void {
        Table.from( rows ).render();
    }

    public render(): void {
        Deno.stdout.writeSync( encode( this.toString() ) );
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

        return this.map( ( iRow: IRow ) => {

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
                    cells += border.left;
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
                    cells += border.middle;
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
                    cells += border.right;
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
        const words: string = consumeWords( length, cell.toString() );
        const next = cell.slice( words.length + 1 );
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
            cells.push( ( cell.getBorder() ? border.top : ' ' ).repeat( opts.padding[ i ] + opts.width[ i ] + opts.padding[ i ] ) );
        }

        return ' '.repeat( this.options.indent || 0 ) + border.topLeft + cells.join( border.topMid ) + ( border.topRight ) + '\n';
    }

    protected renderBorderMidRow( row: Row<Cell>, prevRow: Row<Cell> | undefined, nextRow: Row<Cell> | undefined, opts: ICalc ): string {

        let cells = [];

        for ( let i = 0; i < opts.columns; i++ ) {
            const cell: Cell = row[ i ];
            const nextCell = nextRow && nextRow[ i ];
            cells.push( ( cell.getBorder() && nextCell?.getBorder() !== false ? border.mid : ' ' ).repeat( opts.padding[ i ] + opts.width[ i ] + opts.padding[ i ] ) );
        }

        return ' '.repeat( this.options.indent || 0 ) + border.leftMid + cells.join( border.midMid ) + ( border.rightMid ) + '\n';
    }

    protected renderBorderBottomRow( row: Row<Cell>, prevRow: Row<Cell> | undefined, nextRow: Row<Cell> | undefined, opts: ICalc ): string {

        let cells = [];

        for ( let i = 0; i < opts.columns; i++ ) {
            const cell: Cell = row[ i ];
            cells.push( ( cell.getBorder() ? border.bottom : ' ' ).repeat( opts.padding[ i ] + opts.width[ i ] + opts.padding[ i ] ) );
        }

        return ' '.repeat( this.options.indent || 0 ) + border.bottomLeft + cells.join( border.bottomMid ) + ( border.bottomRight ) + '\n';
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
