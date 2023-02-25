#!/usr/bin/env -S deno run

import { keypress, KeyPressEvent } from "../../keypress/mod.ts";

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
