import camelCase from './camelCase.ts';

const { env } = Deno;

/**
 * Build up the default `inspectOpts` object from the environment variables.
 * Used in `deno.inspect` in node.
 * Checkout deno source code for `inspect`: https://github.com/denoland/deno/blob/master/js/console.ts
 *
 * $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */
export interface InspectOpts {
    hideDate?: boolean | undefined;
    colors?: boolean | undefined;
    depth?: number | undefined;
    showHidden?: boolean | undefined;
    indentLevel?: number;
}

export function getInspectOpts(): InspectOpts {
    const currentEnv = env();
    const inspectOpts: InspectOpts = Object
        .keys( currentEnv )
        .filter( key => /^debug_/i.test( key ) )
        .reduce( ( obj: any, key ) => {
            const prop = camelCase( key.slice( 6 ) );

            if ( !prop ) {
                return;
            }

            let envVar: string = currentEnv[ key ];
            let val: boolean | number | null;
            if ( /^(yes|on|true|enabled)$/i.test( envVar ) ) {
                val = true;
            } else if ( /^(no|off|false|disabled)$/i.test( envVar ) ) {
                val = false;
            } else if ( envVar === 'null' ) {
                val = null;
            } else {
                val = Number( envVar );
            }

            obj[ prop ] = val;
            return obj;
        }, {} );
    return inspectOpts;
}
