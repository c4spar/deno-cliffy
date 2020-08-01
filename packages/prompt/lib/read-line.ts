import { decode } from 'https://deno.land/std@v0.63.0/encoding/utf8.ts';
import { BufReader } from 'https://deno.land/std@v0.63.0/io/bufio.ts';
import { KeyCode, KeyEvent } from '../../keycode/mod.ts';

export async function readLineSync(): Promise<string | undefined> {
    const result = await new BufReader( Deno.stdin ).readLine();
    return result ? decode( result.line ) : undefined;
}

export async function readCharSync(): Promise<Uint8Array | undefined> {

    const buffer = new Uint8Array( 8 );

    Deno.setRaw( Deno.stdin.rid, true );
    const nread: number | null = await Deno.stdin.read( buffer );
    Deno.setRaw( Deno.stdin.rid, false );

    if ( nread === null ) {
        return;
    }

    return buffer.subarray( 0, nread );
}

export async function readKeySync(): Promise<KeyEvent[]> {

    const data = await readCharSync();

    return data ? KeyCode.parse( data ) : [];
}
