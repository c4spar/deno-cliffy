# Cliffy - KeyCode 

ANSI key code parser for [Deno](https://deno.land/). Used by cliffy's [prompt](../prompt/) module.

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github) ![GitHub Release Date](https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github)

![Build Status](https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master) ![Deno version](https://img.shields.io/badge/deno-v1.0.0%20rc2-green?logo=deno) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/c4spar/deno-cliffy?logo=github) ![GitHub issues](https://img.shields.io/github/issues/c4spar/deno-cliffy?logo=github) ![GitHub licence](https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github)

## Example

```typescript
#!/usr/bin/env -S deno run

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

```

## Documentation

### KeyCode

* parse( data: Uint8Array | string ): KeyEvent | undefined

### KeyEvent

* name?: string
* sequence?: string
* ctrl: boolean
* meta: boolean
* shift: boolean

## License

[MIT](LICENSE)
