#!/usr/bin/env -S deno run

import { Command } from '../../command/command.ts';

const { options } = await new Command()
    .option( '-s, --silent', 'disable output.' )
    .option( '-d, --debug [level]', 'output extra debugging.' )
    .option( '-p, --port <port>', 'the port number.' )
    .option( '-h, --host [hostname]', 'the host name.', { default: 'localhost' } )
    .option( '-a, --allow [hostname]', 'the host name.', { default: 'localhost' } )
    .parse( Deno.args );

console.log( 'server running at %s:%s', options.host, options.port );
