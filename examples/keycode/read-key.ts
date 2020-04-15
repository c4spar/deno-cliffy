#!/usr/bin/env -S RUST_BACKTRACE=1 deno

import { KeyCode } from '../../packages/keycode/lib/key-code.ts';

async function read(): Promise<void> {

    const buffer = new Uint8Array( 8 );

    Deno.setRaw( 0, true );
    const nread = await Deno.stdin.read( buffer );
    Deno.setRaw( 0, false );

    if ( nread === Deno.EOF ) {
        return;
    }

    const data = buffer.subarray( 0, nread );

    const event = KeyCode.parse( data );

    if ( event && event.name === 'c' && event.ctrl ) {
        console.log( 'exit' );
        return;
    }

    console.log( event );

    await read();
}

await read();
