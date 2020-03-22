#!/usr/bin/env -S deno --allow-env

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .version( '0.1.0' )
    .parse( Deno.args );
