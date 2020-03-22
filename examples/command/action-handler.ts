#!/usr/bin/env -S deno --allow-env

import { Command } from '../../packages/command/lib/command.ts';
import { IFlags } from '../../packages/flags/lib/types.ts';

await new Command()
    .command( 'rm <dir>' )
    .option( '-r, --recursive [recursive:boolean]', 'Remove recursively' )
    .action( ( { recursive }: IFlags, dir: string ) => {
        console.log( 'remove ' + dir + ( recursive ? ' recursively' : '' ) );
    } )
    .parse( Deno.args );
