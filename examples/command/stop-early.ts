#!/usr/bin/env -S deno run

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .version( '0.1.0' )

    .stopEarly()
    .option( '-d, --debug-level <level:string>', 'Debug level.' )
    .arguments( '[script:string] [...args:number]' )
    .action( ( options: any, script: string, args: string[] ) => {
        console.log( 'options:', options );
        console.log( 'script:', script );
        console.log( 'args:', args );
    } )
    .parse( Deno.args );
