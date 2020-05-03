import { BufReader, ReadLineResult } from 'https://deno.land/std@v0.42.0/io/bufio.ts';
import { KeyCode, KeyEvent } from '../../keycode/mod.ts';

export async function readLineSync(): Promise<string> {
    const result = await new BufReader( Deno.stdin ).readLine();
    return new TextDecoder().decode( ( <ReadLineResult>result ).line );
}

export async function readCharSync(): Promise<Uint8Array | undefined> {

    const buffer = new Uint8Array( 8 );

    Deno.setRaw( 0, true );
    const nread: number | null = await Deno.stdin.read( buffer );
    Deno.setRaw( 0, false );

    if ( nread === null ) {
        return;
    }

    return buffer.subarray( 0, nread );
}

export async function readKeySync(): Promise<KeyEvent | undefined> {

    const data = await readCharSync();

    return data && KeyCode.parse( data );
}
