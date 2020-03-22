#!/usr/bin/env -S deno --allow-env

import { Command } from '../../packages/command/lib/command.ts';

const { options } = await new Command()
    .option( '-a, --audio-codec <type:string>', 'description ...' )
    .option( '-v, --video-codec <type:string>', 'description ...', { requires: [ 'audio-codec' ] } )
    .parse( Deno.args );

console.log( options );
