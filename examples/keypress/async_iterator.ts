#!/usr/bin/env -S deno run --unstable

import { keypress, KeyPressEvent } from "../../keypress/keypress.ts";

for await (const event: KeyPressEvent of keypress()) {
  console.log("type: %s, repeating: %s", event.type, event.repeating);
  if (event.ctrlKey && event.key === "c") {
    console.log("exit");
    break;
  }
}
