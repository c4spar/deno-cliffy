#!/usr/bin/env -S deno run --unstable

import { KeyPress, KeyPressEvent } from "../../keypress/keypress.ts";

const keypress: KeyPress = new KeyPress();

const timeout: number = setTimeout(() => {
  console.log("auto dispose");
  keypress.dispose();
  Deno.stdin.close();
}, 3000);

keypress.addEventListener("keypress", (event: KeyPressEvent) => {
  console.log("# event");
  if (event.ctrlKey && event.key === "x") {
    console.log("Canceled within event listener.");
    event.preventDefault();
    // keypress.dispose();
    clearTimeout(timeout);
  }
});

for await (const event of keypress) {
  console.log("# iterator");
  if (event.ctrlKey && event.key === "c") {
    console.log("Canceled within for loop.");
    keypress.dispose();
    clearTimeout(timeout);
    break;
  }
}
