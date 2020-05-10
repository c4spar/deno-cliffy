#!/usr/bin/env -S deno

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .option( '-s, --standalone [value:boolean]', 'Some standalone option.', { standalone: true } )
    .option( '-o, --other [value:boolean]', 'Some other option.' )
    .parse( Deno.args );
