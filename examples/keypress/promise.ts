#!/usr/bin/env -S deno run

import { keypress, KeyPressEvent } from "jsr:@cliffy/keypress@1.0.0-rc.8";

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
