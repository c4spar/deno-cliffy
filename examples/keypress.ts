#!/usr/bin/env -S deno run --unstable

import {
  keypress,
  KeyPressEvent,
} from "https://deno.land/x/cliffy@v0.24.3/keypress/mod.ts";

/** Promise */
const event: KeyPressEvent = await keypress();
console.log("Key pressed: %s", event.key);

/** AsyncIterator */
for await (const event: KeyPressEvent of keypress()) {
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
