#!/usr/bin/env -S deno

import { Command } from '../../packages/command/lib/command.ts';
import { IFlags } from '../../packages/flags/lib/types.ts';

await new Command()
    .version( '0.1.0' )
    .command( 'rmdir <dirs...:string>' )
    .action( ( options: IFlags, dirs: string[] ) => {
        dirs.forEach( ( dir: string ) => {
            console.log( 'rmdir %s', dir );
        } );
    } )
    .parse( Deno.args );
