#!/usr/bin/env -S deno run --unstable

import { keypress, KeyPressEvent } from "../../keypress/keypress.ts";

keypress().addEventListener("keydown", (event: KeyPressEvent) => {
  console.log(
    "type: %s, key: %s, ctrl: %s, meta: %s, shift: %s",
    event.type,
    event.key,
    event.ctrlKey,
    event.metaKey,
    event.shiftKey,
  );
  if (event.ctrlKey && event.key === "c") {
    console.log("exit");
    event.preventDefault();
  }
});
