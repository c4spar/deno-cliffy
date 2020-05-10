#!/usr/bin/env -S deno run

import { Command } from '../../packages/command/lib/command.ts';

const { options, args } = await new Command()
    .version( '0.1.0' )
    .arguments( '<cmd:string> [env:string] [dirs...:string]' )
    .parse( Deno.args );

console.log( 'command:', args[0] );
console.log( 'environment:', args[1] || "no environment given");
console.log( 'directories:', args[2] || "no directories given");
