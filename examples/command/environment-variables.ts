#!/usr/bin/env -S deno --allow-env

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .env( 'SOME_ENV_VAR=<value:number>', 'Description ...' )
    .parse( Deno.args );

console.log( Deno.env().SOME_ENV_VAR );
