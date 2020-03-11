/**
 * Get next words from the beginning of {content} until all words have a length lower then {length}.
 *
 * @param length    Max length of all words.
 * @param content   The text content.
 */
export function consumeWords( length: number, content: string ): string {

    let consumed = '';
    const words = content.split( / /g );

    for ( let i = 0; i < words.length; i++ ) {

        let word: string;
        let hasLineBreak = words[ i ].indexOf( '\n' ) !== -1;

        if ( hasLineBreak ) {
            word = words[ i ].split( '\n' ).shift() || '';
        } else {
            word = words[ i ];
        }

        consumed += ( i > 0 ? ' ' : '' ) + word;

        if ( hasLineBreak ) {
            break;
        }

        const next = words[ i + 1 ];
        if ( next ) {
            const nextLength = stripeColors( next ).length;
            const consumedLength = stripeColors( consumed ).length;
            if ( consumedLength + 1 + nextLength > length ) {
                break;
            }
        }
    }

    return consumed;
}

const COLOR_REGEX: RegExp = /(\x1b|\e|\033)\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]/g;

/**
 * Remove color codes from string.
 *
 * @param str
 */
export function stripeColors( str: string ): string {
    return str.replace( COLOR_REGEX, '' );
}

/**
 * Fill string with given char until the string has a specified length.
 *
 * @param count The length until the string will be filled.
 * @param str   The string to fill.
 * @param char  The char to fill the string with.
 */
export function fill( count: number, str: string = '', char: string = ' ' ) {

    while ( str.length < count ) {
        str += char;
    }

    return str;
}

/**
 * Get longest cell from given row index.
 *
 * @param index Row index.
 * @param rows  The rows.
 */
export function longest( index: number, rows: string[][] ): number {
    return Math.max( ...rows.map( row => stripeColors( row[ index ] || '' ).length || 0 ) );
}
