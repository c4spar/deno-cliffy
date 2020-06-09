#!/usr/bin/env -S deno run

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .name( 'cliffy' )
    .version( '0.1.0' )
    .description( `Command line framework for Deno` )
    .parse( Deno.args );
