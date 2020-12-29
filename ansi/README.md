<h1 align="center">Cliffy ❯ Ansi</h1>

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
  <a href="https://doc.deno.land/https/deno.land/x/cliffy/ansi/mod.ts">
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
  <b>Ansi escape sequences for Deno.</b><br>
  <sub>>_ Control cli cursor, erase output, scroll window and more.</sub>
</p>

## ❯ Content

- [Install](#-install)
- [Usage](#-usage)
  - [Ansi](#ansi)
  - [Tty](#tty)
  - [Colors](#colors)
- [Contributing](#-contributing)
- [License](#-license)

## ❯ Install

This module can be imported directly from the repo and from following registries.

Deno Registry

```typescript
import { ansi, colors, tty, cursorTo } from "https://deno.land/x/cliffy@<version>/ansi/mod.ts";
```

Nest Registry

```typescript
import { ansi, colors, tty, cursorTo } from "https://x.nest.land/cliffy@<version>/ansi/mod.ts";
```

Github

```typescript
import { ansi, colors, tty, cursorTo } from "https://raw.githubusercontent.com/c4spar/deno-cliffy/<version>/ansi/mod.ts";
```

## ❯ Usage

The ansi module exports an `ansi` and a `tty` object which have chainable methods and properties for generating and writing ansi escape sequences. `ansi` and `tty` have allmost the same properties and methods.`ansi` generates and returns an ansi string, and `tty` writes the generated ansi escape sequence directly to stdout.

Both objects can be also invoked as method to create a new instance from itself.

### Ansi

Returns generated ansi escape sequences.

```typescript
import { ansi } from "https://deno.land/x/cliffy/ansi/ansi.ts";

console.log(
  myAnsi.cursorUp.cursorLeft.eraseDown()
);

// or:
await Deno.stdout.write(
  new TextEncoder().encode(
    ansi.cursorUp.cursorLeft.eraseDown()
  )
);

// or:
await Deno.stdout.write(
  ansi.cursorUp.cursorLeft.eraseDown.toBuffer()
);
```

You can also directly import the ansi escape methods from the `ansi_escapes.ts` module.

```typescript
import { cursorTo, eraseDown, image, link } from "https://deno.land/x/cliffy/ansi/ansi_escapes.ts";

const response = await fetch("https://deno.land/images/hashrock_simple.png");
const imageBuffer: ArrayBuffer = await response.arrayBuffer();

console.log(
  cursorTo(0, 0) +
  eraseDown() +
  image(imageBuffer, {
    width: 29,
    preserveAspectRatio: true,
  }) +
  "\n          " +
  link("Deno Land", "https://deno.land") +
  "\n",
);
```

### Tty

Writes generated ansi escape sequences directly to stdout.

```typescript
import { tty } from "https://deno.land/x/cliffy/ansi/tty.ts";

tty.cursorSave
   .cursorHide
   .cursorTo(0, 0)
   .eraseScreen();
```

Create a new instance.

```typescript
import { tty } from "https://deno.land/x/cliffy/ansi/tty.ts";

const myTty = tty({
  stdout: Deno.stdout,
  stdin: Deno.stdin
});

myTty.cursorSave
   .cursorHide
   .cursorTo(0, 0)
   .eraseScreen();
```

### Colors

The colors module is a simple and tiny chainable wrapper around [deno's std colors](https://deno.land/std@0.82.0/fmt/colors.ts)
module and works similar to node's [chalk](https://github.com/chalk/chalk) module.

```typescript
import { colors } from "https://deno.land/x/cliffy/ansi/colors.ts";

console.log(
  colors.bold.underline.rgb24("Welcome to Deno.Land!", 0xff3333),
);
```

```
$ deno run https://deno.land/x/cliffy/examples/ansi/colors.ts
```

Define your own themes:

```typescript
const error = colors.bold.red();
const warn = colors.bold.yellow();
const info = colors.bold.blue();

console.log(error("[ERROR]"), "Some error!");
console.log(warn("[WARN]"), "Some warning!");
console.log(info("[INFO]"), "Some information!");
```

```
$ deno run https://deno.land/x/cliffy/examples/ansi/color_themes.ts
```

## ❯ Contributing

Any kind of contribution is welcome! Please take a look at the [contributing guidelines](../CONTRIBUTING.md).

## ❯ License

[MIT](../LICENSE)
