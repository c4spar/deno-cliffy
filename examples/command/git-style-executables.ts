#!/usr/bin/env -S deno run

import { Command } from '../../command/command.ts';

await new Command()
    .version( '0.1.0' )
    .command( 'install [name]', 'install one or more packages' )
    .command( 'search [query]', 'search with optional query' )
    .command( 'update', 'update installed packages', { executableFile: 'myUpdateSubCommand' } )
    .command( 'list', 'list packages installed', { isDefault: true } )
    .parse( Deno.args );
