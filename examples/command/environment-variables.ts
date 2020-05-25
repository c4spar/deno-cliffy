#!/usr/bin/env -S deno run --allow-env --unstable

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .env( 'SOME_ENV_VAR=<value:number>', 'Description ...', { global: true, hidden: false } )
    .command( 'hello' )
    .description( 'world ...' )
    .parse( Deno.args );

console.log( Deno.env.get( 'SOME_ENV_VAR' ) );
