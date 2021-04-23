#!/usr/bin/env -S deno run --unstable

import { keypress, KeyPressEvent } from "../../keypress/keypress.ts";

const event: KeyPressEvent = await keypress();

console.log(
  "type: %s, key: %s, ctrlKey: %s, metaKey: %s, shiftKey: %s",
  event.type,
  event.key,
  event.ctrlKey,
  event.metaKey,
  event.shiftKey,
);
