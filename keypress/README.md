<h1 align="center">Cliffy ❯ Keypress </h1>

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
  <a href="https://github.com/c4spar/deno-cliffy/labels/module%3Akeypress">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy/module:keypress?label=issues&logo=github&color=yellow">
  </a>
  <a href="https://deno.land/">
    <img alt="Deno version" src="https://img.shields.io/badge/deno-^1.4.0-blue?logo=deno" />
  </a>
  <a href="https://doc.deno.land/https/deno.land/x/cliffy/keypress/mod.ts">
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
  <b>Keypress module with promise, async iterator and event target API</b></br>
</p>

## ❯ Content

- [Install](#-install)
- [Usage](#-usage)
  - [Promise](#promise)
  - [Async Iterator](#async-iterator)
  - [Event Target](#event-target)
- [API](#-api)
  - [keypress](#keypress)
  - [Keypress](#keypress-1)
  - [KeyPressEvent](#keypressevent)
- [Contributing](#-contributing)
- [License](#-license)

## ❯ Install

This module can be imported directly from the repo and from following
registries.

Deno Registry

```typescript
import {
  Keypress,
  keypress,
  KeyPressEvent,
} from "https://deno.land/x/cliffy@<version>/keypress/mod.ts";
```

Nest Registry

```typescript
import {
  Keypress,
  keypress,
  KeyPressEvent,
} from "https://x.nest.land/cliffy@<version>/keypress/mod.ts";
```

Github

```typescript
import {
  Keypress,
  keypress,
  KeyPressEvent,
} from "https://raw.githubusercontent.com/c4spar/deno-cliffy/<version>/keypress/mod.ts";
```

## ❯ Usage

There are two ways to use this module. You can use the `keypress()` method,
which returns a global instance of the `KeyPress` class, or you can create a new
instance of the `KeyPress` class. There is no difference between these two ways,
except that the `keypress()` method always returns the same instance, unless the
`.dispose()` method is called. In this case a new instance is returned.

## Promise

The keypress module can be used as promise. It reads one chunk from stdin and
returns an `KeyPressEvent` for the first parsed character.

```typescript
import {
  keypress,
  KeyPressEvent,
} from "https://deno.land/x/cliffy/keypress/mod.ts";

const event: KeyPressEvent = await keypress();

console.log(
  "type: %s, key: %s, ctrl: %s, meta: %s, shift: %s, alt: %s, repeat: %s",
  event.type,
  event.key,
  event.ctrlKey,
  event.metaKey,
  event.shiftKey,
  event.altKey,
  event.repeat,
);
```

```
$ deno run --unstable --reload https://deno.land/x/cliffy/examples/keypress/promise.ts
```

## Async Iterator

The keypress module can be used as async iterator to iterate over all keypress
events. The async iterator reads chunk by chunk from stdin. On each step, it
reads one chunk from stdin and emits for each character a keypress event. It
pauses reading from stdin before emitting the events, so stdin is not blocked
inside the for loop.

```typescript
import { Keypress, keypress } from "https://deno.land/x/cliffy/keypress/mod.ts";

for await (const event: KeyPressEvent of keypress()) {
  console.log(
    "type: %s, key: %s, ctrl: %s, meta: %s, shift: %s, alt: %s, repeat: %s",
    event.type,
    event.key,
    event.ctrlKey,
    event.metaKey,
    event.shiftKey,
    event.altKey,
    event.repeat,
  );
  if (event.ctrlKey && event.key === "c") {
    console.log("exit");
    break;
  }
}
```

```
$ deno run --unstable --reload https://deno.land/x/cliffy/examples/keypress/async_iterator.ts
```

## Event Target

The Keypress class extends from the EventTarget class that provides a
`.addEventListener()` method that can be used to register event listeners. The
addEventListener method starts an event loop in the background that reads from
stdin and emits an event for each input. During this time stdin is blocked for
other resources. The event loop can be stopped with `event.preventDefault()` or
`keypress().dispose()`. The promise and asynchronous iterator based solution
does not start an event loop in the background.

```typescript
import {
  keypress,
  KeyPressEvent,
} from "https://deno.land/x/cliffy/keypress/mod.ts";

keypress().addEventListener("keydown", (event: KeyPressEvent) => {
  console.log(
    "type: %s, key: %s, ctrl: %s, meta: %s, shift: %s, alt: %s, repeat: %s",
    event.type,
    event.key,
    event.ctrlKey,
    event.metaKey,
    event.shiftKey,
    event.altKey,
    event.repeat,
  );
  if (event.ctrlKey && event.key === "c") {
    console.log("exit");
    event.preventDefault();
  }
});
```

```
$ deno run --unstable --reload https://deno.land/x/cliffy/examples/keypress/event_target.ts
```

## ❯ API

### keypress

- keypress(): Keypress

### Keypress

- new Keypress(): Promise\<KeyPressEvent> | AsyncIterator\<KeyPressEvent> |
  EventTarget

### KeyPressEvent

- key?: string
- sequence?: string
- code?: string
- ctrlKey: boolean
- metaKey: boolean
- shiftKey: boolean
- altKey: boolean
- repeat: boolean

## ❯ Contributing

Any kind of contribution is welcome! Please take a look at the
[contributing guidelines](../CONTRIBUTING.md).

## ❯ License

[MIT](../../LICENSE)
