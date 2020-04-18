# Cliffy - ANSI Escape 

ANSI escape module for handling cli cursor, erase output and scroll window.

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github) ![GitHub Release Date](https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github)

![Build Status](https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master) ![Deno version](https://img.shields.io/badge/deno-v0.41.0|v0.40.0|v0.39.0-green?logo=deno) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/c4spar/deno-cliffy?logo=github) ![GitHub issues](https://img.shields.io/github/issues/c4spar/deno-cliffy?logo=github) ![GitHub licence](https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github)

## Usage

```typescript
#!/usr/bin/env -S deno

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

[MIT](LICENSE)
