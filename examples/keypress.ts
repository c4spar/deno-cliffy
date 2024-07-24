#!/usr/bin/env -S deno run

import { keypress, KeyPressEvent } from "../keypress/mod.ts";

/** Promise */
const event: KeyPressEvent = await keypress();
console.log("Key pressed: %s", event.key);

/** AsyncIterator */
for await (const event of keypress()) {
  console.log("Key pressed: %s", event.key);
  if (event.ctrlKey && event.key === "c") {
    console.log("exit");
    break;
  }
}

/** EventTarget */
keypress().addEventListener("keydown", (event: KeyPressEvent) => {
  console.log("Key pressed: %s", event.key);
  if (event.ctrlKey && event.key === "c") {
    console.log("exit");
    keypress().dispose();
  }
});
