#!/usr/bin/env -S deno run --unstable

import { keypress, KeyPressEvent } from "../../keypress/keypress.ts";

keypress().addEventListener("keydown", (event: KeyPressEvent) => {
  console.log("type: %s, repeating: %s", event.type, event.repeating);
  // console.log({ ...event });
  if (event.ctrlKey && event.key === "c") {
    console.log("exit");
    event.preventDefault();
  }
});

keypress().addEventListener("keyup", (event: KeyPressEvent) => {
  console.log("type: %s, repeating: %s", event.type, event.repeating);
});
