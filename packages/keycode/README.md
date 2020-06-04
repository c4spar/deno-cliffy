<h1 align="center">Cliffy ❯ KeyCode </h1>

<p align="center">
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Version" src="https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Release date" src="https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github&color=blue" />
  </a>
  <a href="https://deno.land/">
    <img alt="Deno version" src="https://img.shields.io/badge/deno-^1.0.0-blue?logo=deno" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Build status" src="https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/labels/module%3Akeycode">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy/module:keycode?label=issues&logo=github">
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Licence" src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" />
  </a>
</p>

<p align="center">
  <b>ANSI key code parser for <a href="https://deno.land/">Deno</a></b></br>
  <sub>>_ Used by cliffy's <a href="../prompt/">prompt</a> module.<sub>
</p>

## Usage

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
