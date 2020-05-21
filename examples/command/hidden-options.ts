#!/usr/bin/env -S deno run

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .option( '-H, --hidden [hidden:boolean]', 'Nobody knows about me!', { hidden: true } )
    .parse( Deno.args );
