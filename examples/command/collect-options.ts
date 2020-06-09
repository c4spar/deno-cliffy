#!/usr/bin/env -S deno run

import { Command } from '../../packages/command/lib/command.ts';

const { options } = await new Command()
    .option( '-c, --color <color:string>', 'read from file ...', { collect: true } )
    .parse( Deno.args );

console.log( options );
