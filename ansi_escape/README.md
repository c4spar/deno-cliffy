<h1 align="center">Cliffy ❯ ANSI Escape</h1>

<p align="center" class="badges-container">
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3ATest">
    <img alt="Build status" src="https://github.com/c4spar/deno-cliffy/workflows/Test/badge.svg?branch=master" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Version" src="https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github&color=blue&label=latest" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/labels/module%3Aansi-escape">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy/module:ansi-escape?label=issues&logo=github&color=yellow">
  </a>
  <a href="https://deno.land/">
    <img alt="Deno version" src="https://img.shields.io/badge/deno-^1.2.0-blue?logo=deno" />
  </a>
  <a href="https://doc.deno.land/https/deno.land/x/cliffy/ansi_escape/mod.ts">
    <img alt="doc" src="https://img.shields.io/badge/deno-doc-yellow?logo=deno" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/blob/master/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" />
  </a>
  <a href="https://nest.land/package/cliffy">
    <img src="https://nest.land/badge.svg" alt="nest.land badge">
  </a>
</p>

<p align="center">
  <b>Control cli cursor, erase output and scroll window.</b><br>
  <sub>>_ Used by cliffy's <a href="../prompt/">prompt</a> module</sub>
</p>

## ❯ Content

- [Install](#-install)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

## ❯ Install

This module can be imported directly from the repo and from following registries.

Deno Registry

```typescript
import { tty } from "https://deno.land/x/cliffy@<version>/ansi_escape/mod.ts";
```

Nest Registry

```typescript
import { tty } from "https://x.nest.land/cliffy@<version>/ansi_escape/mod.ts";
```

Github

```typescript
import { tty } from "https://raw.githubusercontent.com/c4spar/deno-cliffy/<version>/ansi_escape/mod.ts";
```

## ❯ Usage

### tty

Yu can use the predefined tty variable:

```typescript
import { tty } from "https://deno.land/x/cliffy/ansi_escape/mod.ts";

tty
  // Hide cursor.
  .cursorHide()
  // Show cursor.
  .cursorShow()
  // Save cursor position.
  .cursorSave()
  // Hide cursor position.
  .cursorRestore()
  // Erase current line.
  .eraseLine()
  // Erase three line's up.
  .eraseLines(3)
  // Scroll two line's up.
  .scrollUp(2)
  // Scroll one line down.
  .scrollDown()
  // ...
```

### AnsiEscape

```typescript
import { AnsiEscape } from "https://deno.land/x/cliffy/ansi_escape/mod.ts";

const tty: AnsiEscape = AnsiEscape.from(Deno.stdout)
  .cursorHide()
  .cursorShow()
  // ...
```

### Custom

```typescript
import { cursor, erase, image, link } from "../../ansi_escape/csi.ts";

const response = await fetch("https://deno.land/images/hashrock_simple.png");
const imageBuffer: ArrayBuffer = await response.arrayBuffer();

Deno.stdout.writeSync(
  new TextEncoder().encode(
    cursor.to(0, 0) +
    erase.down() +
    image(imageBuffer, {
      width: 29,
      preserveAspectRatio: true,
    }) +
    "\n          " +
    link("Deno Land", "https://deno.land") +
    "\n",
  ),
);
```

## ❯ Contributing

Any kind of contribution is welcome! Please take a look at the [contributing guidelines](../CONTRIBUTING.md).

## ❯ License

[MIT](../LICENSE)
