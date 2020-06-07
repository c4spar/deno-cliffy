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
        } else if ( arg[ 0 ] === '-' ) {
            if ( arg.includes( '=' ) ) {
                const parts = arg.split( '=' );
                const flag = parts.shift() as string;
                if ( arg[ 1 ] === '-' ) {
                    normalized.push( flag );
                } else {
                    flag.slice( 1 ).split( '' ).forEach( val => normalized.push( `-${ val }` ) );
                }
                normalized.push( parts.join( '=' ) );
            } else if ( arg[ 1 ] === '-' ) {
                normalized.push( arg );
            } else {
                arg.slice( 1 ).split( '' ).forEach( val => normalized.push( `-${ val }` ) );
            }
        } else {
            normalized.push( arg );
        }
    }

    return normalized;
}
