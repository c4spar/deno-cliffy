#!/usr/bin/env -S deno run

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .version( '0.1.0' )

    .command( 'global [val:string]' )
    .description( 'global ...' )
    .global()
    .action( console.log )

    .command( 'command1', new Command()
        .description( 'Some sub command.' )

        .command( 'command2', new Command()
            .description( 'Some nested sub command.' )
        )
    )
    .parse( Deno.args );
