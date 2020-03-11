/**
 * Normalize command line arguments.
 *
 * @param args Command line arguments e.g: `Deno.args`
 */
export function normalize( args: string[] ) {

    const normalized = [];
    let inLiteral = false;

    for ( const arg of args ) {

        if ( inLiteral ) {
            normalized.push( arg );
        } else if ( arg === '--' ) {
            inLiteral = true;
            normalized.push( arg );
        } else if ( arg[ 0 ] === '-' && arg[ 1 ] !== '-' ) {
            arg.slice( 1 ).split( '' ).forEach( val => normalized.push( `-${ val }` ) );
        } else {
            normalized.push( arg );
        }
    }

    return normalized;
}
