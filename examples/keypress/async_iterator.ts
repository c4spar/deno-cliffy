#!/usr/bin/env -S deno run --unstable

import { keypress, KeyPressEvent } from "../../keypress/keypress.ts";

for await (const event: KeyPressEvent of keypress()) {
  console.log(
    "type: %s, key: %s, ctrlKey: %s, metaKey: %s, shiftKey: %s",
    event.type,
    event.key,
    event.ctrlKey,
    event.metaKey,
    event.shiftKey,
  );
  if (event.ctrlKey && event.key === "c") {
    console.log("exit");
    break;
  }
}
