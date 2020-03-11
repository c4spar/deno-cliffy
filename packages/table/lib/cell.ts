import { MAX_CELL_WIDTH } from './const.ts';
import { consumeWords, fill, stripeColors } from './utils.ts';

/**
 * Add cell to row.
 *
 * @param row       The row on which the cell will be appended.
 * @param cell      The cell to append.
 * @param maxLength Max cell length.
 */
export function addCell( row: string[], cell: string, maxLength: number = MAX_CELL_WIDTH ) {

    const length = Math.min( maxLength, stripeColors( cell ).length );

    const current = consumeWords( length, cell );

    let next = cell.slice( current.length + 1 );

    row.push( current + fill( maxLength - stripeColors( current ).length ) );

    return next;
}
