#!/usr/bin/env -S deno run

import { CompletionsCommand } from '../../packages/command/commands/completions.ts';
import { HelpCommand } from '../../packages/command/commands/help.ts';
import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .name( 'help-option-and-command' )
    .version( '0.1.0' )
    .description( 'Sample description ...' )
    .env( 'EXAMPLE_ENVIRONMENT_VARIABLE=<value:boolean>', 'Environment variable description ...' )
    .example( 'Some example', 'Example content ...\n\nSome more example content ...' )
    .command( 'help', new HelpCommand() )
    .command( 'completions', new CompletionsCommand() )
    .parse( Deno.args );
