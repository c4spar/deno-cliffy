#!/usr/bin/env -S deno run --unstable

import { KeyboardEvent, keypress } from "../../keypress/keypress.ts";

keypress().addEventListener("keydown", (event: KeyboardEvent) => {
  console.log("# event");
  if (event.ctrlKey && event.key === "x") {
    console.log("Canceled within event listener.");
    // Stop event loop and iterator.
    event.preventDefault();
    // same as:
    // keypress().dispose();
  }
});

for await (const event of keypress()) {
  console.log("# iterator");
  if (event.ctrlKey && event.key === "c") {
    console.log("Canceled within for loop.");
    // Stop event loop.
    keypress().dispose();
    // Stop iterator.
    break;
  }
}
