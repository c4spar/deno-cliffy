import { encode } from 'https://deno.land/std@v0.39.0/encoding/utf8.ts';
import { bold } from 'https://deno.land/std@v0.39.0/fmt/colors.ts';
import { border } from './border.ts';
import { CELL_PADDING, MAX_CELL_WIDTH, MIN_CELL_WIDTH } from './const.ts';
import { addRow } from './row.ts';
import { ITableOptions } from './types.ts';
import { longest } from './utils.ts';

/**
 * Generate and render table with given option's.
 *
 * @param opts Table option's.
 */
export function renderTable( opts: ITableOptions ) {

    const output: string = table( opts );

    Deno.stdout.writeSync( encode( output + '\n' ) );
}

/**
 * Generate table with given option's.
 *
 * @param opts Table option's.
 */
export function table( opts: ITableOptions ): string {

    const rows: string[][] = [];
    const indent = opts.indent || 0;

    const padding: number[] = [];
    const sizes: number[] = [];

    const cellCount = Math.max( ...opts.rows.map( row => Object.keys( row ).length ) );

    for ( let cellIndex = 0; cellIndex < cellCount; cellIndex++ ) {

        let cellWidth = longest( cellIndex, opts.rows );
        let minCellWidth = Array.isArray( opts.minSize ) ? opts.minSize[ cellIndex ] : opts.minSize;
        let maxCellWidth = Array.isArray( opts.maxSize ) ? opts.maxSize[ cellIndex ] : opts.maxSize;
        let cellPadding = Array.isArray( opts.padding ) ? opts.padding[ cellIndex ] :
            ( typeof opts.padding === 'undefined' ? CELL_PADDING : opts.padding );

        if ( typeof minCellWidth === 'undefined' || isNaN( minCellWidth ) ) {
            minCellWidth = MIN_CELL_WIDTH;
        }
        if ( typeof maxCellWidth === 'undefined' || isNaN( maxCellWidth ) ) {
            maxCellWidth = MAX_CELL_WIDTH;
        }

        padding[ cellIndex ] = cellPadding;
        sizes[ cellIndex ] = Math.min( maxCellWidth, Math.max( minCellWidth, opts.header ? opts.header[ cellIndex ].length : 0, cellWidth ) );
    }

    if ( opts.header ) {
        const header: string[] | undefined = opts.header.map( ( name: string ) => bold( name ) );
        addRow( rows, header, sizes );
    }

    for ( const row of opts.rows ) {
        addRow( rows, row, sizes );
    }

    return ( opts.border ? renderBorderLine( border.top, border.topLeft, border.topMid, border.topRight ) + '\n' : '' ) +
        rows.map( cells => renderRow( cells ) )
            .join( '\n' + ( opts.border ? renderBorderLine( border.mid, border.leftMid, border.midMid, border.rightMid ) + '\n' : '' ) ) +
        ( opts.border ? '\n' + renderBorderLine( border.bottom, border.bottomLeft, border.bottomMid, border.bottomRight ) : '' );

    function renderRow( cells: string[] ) {

        return ''.padEnd( indent ) +
            ( opts.border ? border.left : '' ) +
            cells.map( ( cell, i ) => ( opts.border ? ''.padStart( padding[ i ] ) : '' ) + cell.padEnd( cell.length + padding[ i ] ) )
                 .join( opts.border ? border.middle : '' ) +
            ( opts.border ? border.right : '' );
    }

    function renderBorderLine( border: string, borderLeft: string, borderMid: string, borderRight: string ) {

        if ( !opts.border ) {
            return '';
        }

        let cells = [];

        for ( let i = 0; i < cellCount; i++ ) {
            cells.push( ''.padEnd( padding[ i ] + sizes[ i ] + padding[ i ], border ) );
        }

        return ''.padEnd( indent )
            + borderLeft
            + cells.join( borderMid )
            + ( borderRight );
    }
}
