import { addCell } from './cell.ts';

/**
 * Add row to rows.
 *
 * @param rows  The rows on which the row will be appended.
 * @param row   The row to append.
 * @param size  Max cell length for each cell in the row.
 */
export function addRow( rows: string[][], row: string[], size: number[] ): void {

    const line: string[] = [];
    let buffering = false;

    for ( let i = 0; i < row.length; i++ ) {

        row[ i ] = addCell( line, row[ i ], size[ i ] );

        if ( row[ i ] ) {
            buffering = true;
        }
    }

    rows.push( line );

    if ( buffering ) {
        addRow( rows, row, size );
    }
}
