#!/usr/bin/env -S deno run

import { Command } from '../../command/mod.ts';

await new Command()
    .version( '0.1.0' )
    .command( 'rmdir <dirs...:string>', 'Remove directories.' )
    .action( ( _, dirs: string[] ) => {
        dirs.forEach( ( dir: string ) => {
            console.log( 'rmdir %s', dir );
        } );
    } )
    .parse( Deno.args );
