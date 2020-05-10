#!/usr/bin/env -S deno

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .version( '0.1.0' )
    .description( 'Sample description ...' )
    .env( 'EXAMPLE_ENVIRONMENT_VARIABLE=<value:boolean>', 'Environment variable description ...' )
    .example( 'Some example', 'Example content ...\n\nSome more example content ...' )
    .parse( Deno.args );
