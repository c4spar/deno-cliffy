#!/usr/bin/env -S deno

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .version( '0.1.0' )
    .option( '-i, --info [arg:boolean]', 'Print some info.', {
        standalone: true,
        action: () => {
            console.log( 'Some info' );
            Deno.exit( 0 );
        }
    } )
    .parse( Deno.args );
