#!/usr/bin/env -S deno --allow-env

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .allowEmpty( false )
    .option( '-c, --cheese [type:string]', 'pizza must have cheese', { required: true } )
    .parse( Deno.args );
