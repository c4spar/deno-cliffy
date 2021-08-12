<h1 align="center">Cliffy ❯ KeyCode </h1>

<p align="center" class="badges-container">
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Version" src="https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github&color=blue" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions/workflows/test.yml">
    <img alt="Build status" src="https://github.com/c4spar/deno-cliffy/workflows/Test/badge.svg?branch=main" />
  </a>
  <a href="https://codecov.io/gh/c4spar/deno-cliffy">
    <img src="https://codecov.io/gh/c4spar/deno-cliffy/branch/main/graph/badge.svg"/>
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/labels/module%3Akeycode">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy/module:keycode?label=issues&logo=github&color=yellow">
  </a>
  <a href="https://deno.land/">
    <img alt="Deno version" src="https://img.shields.io/badge/deno-^1.4.0-blue?logo=deno" />
  </a>
  <a href="https://doc.deno.land/https/deno.land/x/cliffy/keycode/mod.ts">
    <img alt="doc" src="https://img.shields.io/badge/deno-doc-yellow?logo=deno" />
  </a>
  <a href="https://discord.gg/ghFYyP53jb">
    <img alt="Discord" src="https://img.shields.io/badge/join-chat-blue?logo=discord&logoColor=white" />
  </a>
  <a href="../LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" />
  </a>
  <br>
  <a href="https://deno.land/x/cliffy">
    <img alt="Discord" src="https://img.shields.io/badge/Published on deno.land-blue?logo=deno&logoColor=959DA6&color=272727" />
  </a>
  <a href="https://nest.land/package/cliffy">
    <img src="https://nest.land/badge.svg" alt="nest.land badge">
  </a>
</p>

<p align="center">
  <b>ANSI key code parser for <a href="https://deno.land/">Deno</a></b></br>
  <sub>>_ Used by cliffy's <a href="../prompt/">prompt</a> module.</sub>
</p>

## ❯ Content

- [Install](#-install)
- [Usage](#-usage)
- [API](#-api)
- [Contributing](#-contributing)
- [License](#-license)

## ❯ Install

This module can be imported directly from the repo and from following
registries.

Deno Registry

```typescript
import {
  KeyCode,
  parse,
} from "https://deno.land/x/cliffy@<version>/keycode/mod.ts";
```

Nest Registry

```typescript
import {
  KeyCode,
  parse,
} from "https://x.nest.land/cliffy@<version>/keycode/mod.ts";
```

Github

```typescript
import {
  KeyCode,
  parse,
} from "https://raw.githubusercontent.com/c4spar/deno-cliffy/<version>/keycode/mod.ts";
```

## ❯ Usage

```typescript
import { parse } from "https://deno.land/x/cliffy/keycode/mod.ts";

console.log(
  parse(
    "\x1b[A\x1b[B\x1b[C\x1b[D\x1b[E\x1b[F\x1b[H",
  ),
);
```

**Output:**

```json
[
  { name: "up", sequence: "\x1b[A", code: "[A", ctrl: false, meta: false, shift: false },
  { name: "down", sequence: "\x1b[B", code: "[B", ctrl: false, meta: false, shift: false },
  { name: "right", sequence: "\x1b[C", code: "[C", ctrl: false, meta: false, shift: false },
  { name: "left", sequence: "\x1b[D", code: "[D", ctrl: false, meta: false, shift: false },
  { name: "clear", sequence: "\x1b[E", code: "[E", ctrl: false, meta: false, shift: false },
  { name: "end", sequence: "\x1b[F", code: "[F", ctrl: false, meta: false, shift: false },
  { name: "home", sequence: "\x1b[H", code: "[H", ctrl: false, meta: false, shift: false }
]
```

## ❯ Example

```typescript
import { KeyCode, parse } from "https://deno.land/x/cliffy/keycode/mod.ts";

async function* keypress(): AsyncGenerator<KeyCode, void> {
  while (true) {
    const data = new Uint8Array(8);

    Deno.setRaw(Deno.stdin.rid, true);
    const nread = await Deno.stdin.read(data);
    Deno.setRaw(Deno.stdin.rid, false);

    if (nread === null) {
      return;
    }

    const keys: Array<KeyCode> = parse(data.subarray(0, nread));

    for (const key of keys) {
      yield key;
    }
  }
}

console.log("Hit ctrl + c to exit.");

for await (const key of keypress()) {
  if (key.ctrl && key.name === "c") {
    console.log("exit");
    break;
  }
  console.log(key);
}
```

> --unstable is required for Deno.setRaw

```console
$ deno run --unstable https://deno.land/x/cliffy/examples/keycode/read_key.ts
```

## ❯ API

### parse()

- `parse( data: Uint8Array | string ): Array<KeyCode>`

### KeyCode

- name?: `string`
- sequence?: `string`
- code?: `string`
- ctrl: `boolean`
- meta: `boolean`
- shift: `boolean`

## ❯ Contributing

Any kind of contribution is welcome! Please take a look at the
[contributing guidelines](../CONTRIBUTING.md).

## ❯ License

[MIT](../../LICENSE)
