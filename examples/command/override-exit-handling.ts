#!/usr/bin/env -S deno run

import { Command } from '../../packages/command/lib/command.ts';

try {
    await new Command()
        .throwErrors()
        .version( '0.1.0' )
        .option( '-p, --pizza-type <type>', 'Flavour of pizza.' )
        .default('help')
        .parse( Deno.args );
} catch ( err ) {
    // custom processing...
    console.error( '[CUSTOM_ERROR]', err );
}
