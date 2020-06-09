#!/usr/bin/env -S deno run

import { Command } from '../../packages/command/lib/command.ts';

const { args } = await new Command()
    .version( '0.1.0' )
    .arguments( '<cmd> [env]' )
    .parse( Deno.args );

console.log( args );
