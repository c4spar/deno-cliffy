#!/usr/bin/env -S deno run

import { Command } from '../../command/command.ts';
import { IFlags } from '../../flags/types.ts';

await new Command()
    .command( 'rm <dir>' )
    .option( '-r, --recursive [recursive:boolean]', 'Remove recursively' )
    .action( ( { recursive }: IFlags, dir: string ) => {
        console.log( 'remove ' + dir + ( recursive ? ' recursively' : '' ) );
    } )
    .parse( Deno.args );
