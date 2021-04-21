#!/usr/bin/env -S deno run --unstable

import { KeyPress, keypress } from "../../keypress/keypress.ts";

const iter: KeyPress = keypress();

const timeout = setTimeout(() => {
  console.log("Press any key to exit.");
  iter.dispose();
}, 3000);

for await (const event of iter) {
  console.log(event);
  if (event.ctrl && event.name === "c") {
    console.log("Canceled by user.");
    clearTimeout(timeout);
    break;
  }
}
