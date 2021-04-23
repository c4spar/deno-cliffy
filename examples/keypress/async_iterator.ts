#!/usr/bin/env -S deno run --unstable

import { KeyboardEvent, keypress } from "../../keypress/keypress.ts";

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
