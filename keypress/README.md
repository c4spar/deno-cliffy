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
  - [KeyboardEvent](#keyboardevent)
- [Contributing](#-contributing)
- [License](#-license)

## ❯ Install

This module can be imported directly from the repo and from following
registries.

Deno Registry

```typescript
import {
  KeyboardEvent,
  Keypress,
  keypress,
} from "https://deno.land/x/cliffy@<version>/keypress/mod.ts";
```

Nest Registry

```typescript
import {
  KeyboardEvent,
  Keypress,
  keypress,
} from "https://x.nest.land/cliffy@<version>/keypress/mod.ts";
```

Github

```typescript
import {
  KeyboardEvent,
  Keypress,
  keypress,
} from "https://raw.githubusercontent.com/c4spar/deno-cliffy/<version>/keypress/mod.ts";
```

## ❯ Usage

## Promise

The keypress module can be used as promise. The promise reads one chunk from
stdin and returns and event for the first character from the chunk.

```typescript
import { KeyboardEvent, keypress } from "../../keypress/keypress.ts";

const event: KeyboardEvent = await keypress();

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
$ deno run --unstable --reload https://deno.land/x/cliffy/examples/keycode/promise.ts
```

## Async Iterator

The keypress module can be used as async iterator to iterate over all keyboard
events. The async iterator reads chunk by chunk from stdin. On each step, it
reads one chunk from stdin and emits for each character a keyboard event. It
pauses reading from stdin before emitting the keyboard event, so stdin is not
blocked inside your loop. It starts reading again from stdin as soon as the next
method from the iterator is called.

```typescript
import { Keypress, keypress } from "../../keypress/keypress.ts";

for await (const event: KeyboardEvent of keypress()) {
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
$ deno run --unstable --reload https://deno.land/x/cliffy/examples/keycode/async_iterator.ts
```

## Event Target

The Keypress class extends from the EventTarget class which provides a
`.addEventListener()` method that can be used to register event listeners. The
addEventListener method starts an event loop in the background which reads from
stdin and emits for each input an event. The event loop can to be stopped with
`event.preventDefault()` and `keypress().dispose()`. For comparison, the promise
and async iterator based solution does not spin up an event loop in the
background.

```typescript
import { KeyboardEvent, keypress } from "../../keypress/keypress.ts";

keypress().addEventListener("keydown", (event: KeyboardEvent) => {
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
$ deno run --unstable --reload https://deno.land/x/cliffy/examples/keycode/event_target.ts
```

## ❯ API

### keypress

- keypress(): Keypress

### Keypress

- new Keypress(): Promise\<KeyboardEvent> | AsyncIterator\<KeyboardEvent> |
  EventTarget

### KeyboardEvent

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
