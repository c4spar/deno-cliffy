#!/usr/bin/env -S deno run

import { Command } from '../../command/command.ts';

// Sub-command implemented using action handler (description is supplied separately to `.command()`)
await new Command()
    .command( 'clone <source:string> [destination:string]' )
    .description( 'Clone a repository into a newly created directory.' )
    .action( ( source: string, destination: string ) => {
        console.log( 'clone command called' );
    } )
    .parse( Deno.args );

// Sub-command implemented using a command instance as second parameter.
await new Command()
    .command( 'clone', new Command()
        .arguments( '<source:string> [destination:string]' )
        .description( 'Clone a repository into a newly created directory.' )
        .action( ( source: string, destination: string ) => {
            console.log( 'clone command called' );
        } ) )
    .parse( Deno.args );

// Command implemented using separate executable file (description is passes as second parameter to `.command()`)
await new Command()
    .command( 'start <service>', 'Start named service.' )
    .command( 'stop [service]', 'Stop named service, or all if no name supplied.' )
    .parse( Deno.args );
