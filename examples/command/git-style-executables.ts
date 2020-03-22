#!/usr/bin/env -S deno --allow-env

import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .version( '0.1.0' )
    .command( 'install [name]', 'install one or more packages' )
    .command( 'search [query]', 'search with optional query' )
    .command( 'update', 'update installed packages', { executableFile: 'myUpdateSubCommand' } )
    .command( 'list', 'list packages installed', { isDefault: true } )
    .parse( Deno.args );
