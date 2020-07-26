<h1 align="center">Cliffy ❯ ANSI Escape</h1>

<p align="center">
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Version" src="https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Release date" src="https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github&color=blue" />
  </a>
  <a href="https://deno.land/">
    <img alt="Deno version" src="https://img.shields.io/badge/deno-^1.2.0-blue?logo=deno" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Build status" src="https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/labels/module%3Aansi-escape">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy/module:ansi-escape?label=issues&logo=github">
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Licence" src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" />
  </a>
</p>

<p align="center">
  <b>Control cli cursor, erase output and scroll window.</b></br>
  <sub>>_ Used by cliffy's <a href="../prompt/">prompt</a> module<sub>
</p>

## Usage

```typescript
#!/usr/bin/env -S deno run

import { AnsiEscape } from 'https://deno.land/x/cliffy/ansi-escape.ts';

AnsiEscape.from( Deno.stdout )
    // Hide cursor:
    .cursorHide()
    // Show cursor:
    .cursorShow()
    // Erase current line:
    .eraseLine()
    // Erase three line's up:
    .eraseLines( 3 )
    // Scroll two line's up:
    .scrollUp( 2 )
    // Scroll one line down:
    .scrollDown()
    // ...
```

## License

[MIT](../../LICENSE)
