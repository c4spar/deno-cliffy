import { Cell, ICell } from './cell.ts';
import { IRow, Row } from './row.ts';
import type { IBorderOptions, ITableSettings, Table } from './table.ts';
import { consumeWords, longest, stripeColors } from './utils.ts';

interface IRenderSettings {
    padding: number[];
    width: number[];
    columns: number;
    hasBorder: boolean;
    hasHeaderBorder: boolean;
    hasBodyBorder: boolean;
    rows: Row<Cell>[];
    header?: Row<Cell>;
}

export class TableLayout {

    public constructor( private table: Table, private options: ITableSettings ) {}

    protected prepare(): IRenderSettings {

        const padding: number[] = [];
        const width: number[] = [];

        let hasBodyBorder: boolean = this.table.getBorder() || this.table.hasBodyBorder();
        let hasHeaderBorder: boolean = this.table.hasHeaderBorder();
        let hasBorder: boolean = hasHeaderBorder || hasBodyBorder;

        Object.keys( this.options.chars ).forEach( ( key: string ) => {
            if ( typeof this.options.chars[ key as keyof IBorderOptions ] !== 'string' ) {
                this.options.chars[ key as keyof IBorderOptions ] = '';
            }
        } );

        const allRows: IRow[] = this.table.slice();
        const headerRow: IRow| undefined = this.table.getHeader();

        if ( headerRow ) {
            allRows.push( headerRow );
        }

        const columns: number = Math.max( ...allRows.map( cells => cells.length ) );

        for ( let colIndex: number = 0; colIndex < columns; colIndex++ ) {
            let minCellWidth: number = Array.isArray( this.options.minCellWidth ) ? this.options.minCellWidth[ colIndex ] : this.options.minCellWidth;
            let maxCellWidth: number = Array.isArray( this.options.maxCellWidth ) ? this.options.maxCellWidth[ colIndex ] : this.options.maxCellWidth;
            padding[ colIndex ] = Array.isArray( this.options.padding ) ? this.options.padding[ colIndex ] : this.options.padding;
            let cellWidth: number = longest( colIndex, allRows, maxCellWidth );
            width[ colIndex ] = Math.min( maxCellWidth, Math.max( minCellWidth, cellWidth ) );
        }

        const rows = this.createRows( this.table, columns );
        const header = headerRow && this.createRow( headerRow, columns );

        return { padding, width, columns, rows, header, hasBorder, hasBodyBorder, hasHeaderBorder };
    }

    protected createRows( rows: IRow[], columns: number ): Row<Cell>[] {
        return rows.map( row => this.createRow( row, columns ) );
    }

    protected createRow( iRow: IRow, columns: number ): Row<Cell> {

        const row: Row = Row.from( iRow );

        if ( this.options.border ) {
            row.border( this.options.border, false );
        }

        for ( let i = 0; i < columns; i++ ) {
            row[ i ] = this.createCell( row[ i ] || new Cell(), row );
        }

        return row as Row<Cell>;
    }

    protected createCell( iCell: ICell, row: Row ): Cell {
        const cell = Cell.from( iCell );
        if ( row.getBorder() ) {
            cell.border( row.getBorder(), false );
        }
        return cell;
    }

    public toString(): string {

        const opts: IRenderSettings = this.prepare();
        const rows: Row<Cell>[] = opts.rows;

        if ( !rows.length ) {
            return '';
        }

        let result: string = '';

        if ( opts.header ) {
            result += this.renderHeader( opts, opts.header );
        }

        result += this.renderBody( opts, rows );

        return result;
    }

    protected renderHeader( opts: IRenderSettings, header: Row<Cell> ) {

        let result: string = '';

        if ( opts.hasHeaderBorder ) {
            result += this.renderBorderRow( undefined, header, opts );
        }

        result += this.renderRows( opts, [ header ] );

        if ( opts.hasHeaderBorder && ( !opts.hasBodyBorder || !opts.rows[ 0 ].hasBorder() ) ) {
            result += this.renderBorderRow( header, opts.rows[ 0 ], opts );
        }

        return result;
    }

    protected renderBody( opts: IRenderSettings, rows: Row<Cell>[] ): string {

        let result: string = '';
        const lastRow: Row<Cell> = rows[ rows.length - 1 ];
        const firstRow: Row<Cell> = rows[ 0 ];

        // border top row
        if ( firstRow.hasBorder() ) {
            result += this.renderBorderRow( opts.header, firstRow, opts );
        }

        // rows
        result += this.renderRows( opts, rows );

        // border bottom row
        if ( lastRow.hasBorder() ) {
            result += this.renderBorderRow( lastRow, undefined, opts );
        }

        return result;
    }

    protected renderRows( opts: IRenderSettings, rows: Row<Cell>[], index: number = 0 ): string {

        let result: string = '';
        const row: Row<Cell> = rows[ index ];
        const prevRow: Row<Cell> | undefined = rows[ index - 1 ];
        const nextRow: Row<Cell> | undefined = rows[ index + 1 ];

        result += this.renderRow( row, prevRow, nextRow, opts );

        // border mid row
        if ( opts.hasBodyBorder && index < rows.length - 1 ) {
            result += this.renderBorderRow( row, nextRow, opts );
        }

        if ( index < rows.length - 1 ) {
            result += this.renderRows( opts, rows, ++index );
        }

        return result;
    }

    protected renderRow( row: Row<Cell>, prevRow: Row<Cell> | undefined, nextRow: Row<Cell> | undefined, opts: IRenderSettings ): string {

        let result: string = '';

        const { cells, isMultilineRow } = this.renderCells( row, opts );

        result += cells;

        if ( isMultilineRow ) { // skip border
            result += this.renderRow( row, prevRow, nextRow, opts );
        }

        return result;
    }

    protected renderCells( row: Row<Cell>, opts: IRenderSettings ) {

        let cells: string = ' '.repeat( this.options.indent || 0 );
        let isMultilineRow: boolean = false;

        let prev: Cell | undefined;

        for ( let i = 0; i < opts.columns; i++ ) {

            const cell: Cell = row[ i ];

            if ( i === 0 ) {
                if ( cell.getBorder() ) {
                    cells += this.options.chars.left;
                } else if ( opts.hasBorder ) {
                    cells += ' ';
                }
            } else {
                if ( cell.getBorder() || prev?.getBorder() ) {
                    cells += this.options.chars.middle;
                } else if ( opts.hasBorder ) {
                    cells += ' ';
                }
            }

            const { current, next } = this.renderCell( cell, opts.width[ i ] );

            next.length && ( isMultilineRow = true );
            row[ i ] = next;

            if ( opts.hasBorder ) {
                cells += ' '.repeat( opts.padding[ i ] );
            }

            cells += current;

            if ( opts.hasBorder || i < opts.columns - 1 ) {
                cells += ' '.repeat( opts.padding[ i ] );
            }

            if ( i === opts.columns - 1 ) {
                if ( cell.getBorder() ) {
                    cells += this.options.chars.right;
                } else if ( opts.hasBorder ) {
                    cells += ' ';
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

    protected renderBorderRow( prevRow: Row<Cell> | undefined, nextRow: Row<Cell> | undefined, opts: IRenderSettings ): string {

        let cells = [];

        for ( let i = 0; i < opts.columns; i++ ) {
            // a1 | b1
            // -------
            // a2 | b2
            const a1: Cell | undefined = prevRow?.[ i - 1 ];
            const a2: Cell | undefined = nextRow?.[ i - 1 ];
            const b1: Cell | undefined = prevRow?.[ i ];
            const b2: Cell | undefined = nextRow?.[ i ];

            const a1Border: boolean = !!a1?.getBorder();
            const a2Border: boolean = !!a2?.getBorder();
            const b1Border: boolean = !!b1?.getBorder();
            const b2Border: boolean = !!b2?.getBorder();

            if ( i === 0 ) {

                if ( b1Border && b2Border ) {
                    cells.push( this.options.chars.leftMid );
                } else if ( b1Border ) {
                    cells.push( this.options.chars.bottomLeft );
                } else if ( b2Border ) {
                    cells.push( this.options.chars.topLeft );
                } else {
                    cells.push( ' ' );
                }

            } else if ( i < opts.columns ) {

                if ( ( a1Border && b2Border ) ||
                    ( b1Border && a2Border ) ||
                    ( b2Border && a1Border ) ||
                    ( a2Border && b1Border ) ) {
                    cells.push( this.options.chars.midMid );

                } else if ( a1Border && b1Border ) {
                    cells.push( this.options.chars.bottomMid );
                } else if ( b1Border && b2Border ) {
                    cells.push( this.options.chars.leftMid );
                } else if ( b2Border && a2Border ) {
                    cells.push( this.options.chars.topMid );
                } else if ( a2Border && a1Border ) {
                    cells.push( this.options.chars.rightMid );

                } else if ( a1Border ) {
                    cells.push( this.options.chars.bottomRight );
                } else if ( b1Border ) {
                    cells.push( this.options.chars.bottomLeft );
                } else if ( a2Border ) {
                    cells.push( this.options.chars.topRight );
                } else if ( b2Border ) {
                    cells.push( this.options.chars.topLeft );

                } else {
                    cells.push( ' ' );
                }
            }

            const length = opts.padding[ i ] + opts.width[ i ] + opts.padding[ i ];
            if ( b1Border && b2Border ) {
                cells.push( this.options.chars.mid.repeat( length ) );
            } else if ( b1Border ) {
                cells.push( this.options.chars.bottom.repeat( length ) );
            } else if ( b2Border ) {
                cells.push( this.options.chars.top.repeat( length ) );
            } else {
                cells.push( ' '.repeat( length ) );
            }

            if ( i === opts.columns - 1 ) {
                if ( b1Border && b2Border ) {
                    cells.push( this.options.chars.rightMid );
                } else if ( b1Border ) {
                    cells.push( this.options.chars.bottomRight );
                } else if ( b2Border ) {
                    cells.push( this.options.chars.topRight );
                } else {
                    cells.push( ' ' );
                }
            }
        }

        const result: string = cells.join( '' );

        if ( !result.length ) {
            return result;
        }

        return ' '.repeat( this.options.indent ) + result + '\n';
    }
}
