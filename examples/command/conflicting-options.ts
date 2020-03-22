#!/usr/bin/env -S deno --allow-env

import { Command } from '../../packages/command/lib/command.ts';

const { options } = await new Command()
    .option( '-f, --file <file:string>', 'read from file ...' )
    .option( '-i, --stdin [stdin:boolean]', 'read from stdin ...', { conflicts: [ 'file' ] } )
    .parse( Deno.args );

console.log( options );
