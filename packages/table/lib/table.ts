import { bold } from 'https://deno.land/std/fmt/colors.ts';
import { CELL_PADDING, MAX_CELL_WIDTH, MIN_CELL_WIDTH } from './const.ts';
import { addRow } from './row.ts';
import { ITableOptions } from './types.ts';
import { fill, longest } from './utils.ts';

/**
 * Generate and render table with given option's.
 *
 * @param opts Table option's.
 */
export function renderTable( opts: ITableOptions ) {

    const output: string = table( opts );

    Deno.stdout.writeSync( new TextEncoder().encode( output + '\n' ) );
}

/**
 * Generate table with given option's.
 *
 * @param opts Table option's.
 */
export function table( opts: ITableOptions ): string {

    const rows: string[][] = [];
    const indent = opts.indent || 0;

    const padding = typeof opts.padding === 'undefined' ? CELL_PADDING : opts.padding;
    const sizes: number[] = [];

    const cellCount = Math.max( ...opts.rows.map( row => Object.keys( row ).length ) );

    for ( let cellIndex = 0; cellIndex < cellCount; cellIndex++ ) {

        let minCellWidth = Array.isArray( opts.minSize ) ? opts.minSize[ cellIndex ] : opts.minSize;
        let maxCellWidth = Array.isArray( opts.maxSize ) ? opts.maxSize[ cellIndex ] : opts.maxSize;
        let cellWidth = longest( cellIndex, opts.rows );

        if ( typeof minCellWidth === 'undefined' || isNaN( minCellWidth ) ) {
            minCellWidth = MIN_CELL_WIDTH;
        }
        if ( typeof maxCellWidth === 'undefined' || isNaN( maxCellWidth ) ) {
            maxCellWidth = MAX_CELL_WIDTH;
        }

        sizes[ cellIndex ] = Math.min( maxCellWidth, Math.max( minCellWidth, opts.header ? opts.header[ cellIndex ].length : 0, cellWidth ) );
    }


    if ( opts.header ) {
        const header: string[] | undefined = opts.header.map( ( name: string ) => bold( name ) );
        addRow( rows, header, sizes );
    }

    for ( const row of opts.rows ) {
        addRow( rows, row, sizes );
    }

    return rows.map( row =>
        fill( indent ) + row.map( ( cell, i ) => {

            const pad: number = Array.isArray( padding ) ? padding[ i ] : padding;

            return fill( pad + cell.length, cell );

        } ).join( '' )
    ).join( '\n' );
}
