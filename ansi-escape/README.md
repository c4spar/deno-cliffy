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
import { AnsiEscape } from "https://deno.land/x/cliffy@<version>/ansi-escape/mod.ts";
```

Nest Registry

```typescript
import { AnsiEscape } from "https://x.nest.land/cliffy@<version>/ansi-escape/mod.ts";
```

Github

```typescript
import { AnsiEscape } from "https://raw.githubusercontent.com/c4spar/deno-cliffy/<version>/ansi-escape/mod.ts";
```

## ❯ Usage

```typescript
import { AnsiEscape } from "https://deno.land/x/cliffy/ansi-escape/mod.ts";

AnsiEscape.from(Deno.stdout)
  // Hide cursor:
  .cursorHide()
  // Show cursor:
  .cursorShow()
  // Erase current line:
  .eraseLine()
  // Erase three line's up:
  .eraseLines(3)
  // Scroll two line's up:
  .scrollUp(2)
  // Scroll one line down:
  .scrollDown()
    // ...
```

## ❯ Contributing

Any kind of contribution is welcome! Please take a look at the [contributing guidelines](../CONTRIBUTING.md).

## ❯ License

[MIT](../LICENSE)
