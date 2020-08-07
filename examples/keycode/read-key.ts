#!/usr/bin/env -S deno run --unstable

import { KeyCode } from '../../keycode/key-code.ts';

async function read(): Promise<void> {

    const buffer = new Uint8Array( 8 );

    Deno.setRaw( Deno.stdin.rid, true );
    const nread = await Deno.stdin.read( buffer );
    Deno.setRaw( Deno.stdin.rid, false );

    if ( nread === null ) {
        return;
    }

    const data = buffer.subarray( 0, nread );

    const [ event ] = KeyCode.parse( data );

    if ( event?.name === 'c' && event.ctrl ) {
        console.log( 'exit' );
        return;
    }

    console.log( event );

    await read();
}

console.log('Hit ctrl + c to exit.');

await read();
