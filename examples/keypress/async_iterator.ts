#!/usr/bin/env -S deno run --unstable

import { keypress, KeyPressEvent } from "../../keypress/keypress.ts";

for await (const event: KeyPressEvent of keypress()) {
  console.log(event);
  if (event.ctrlKey && event.key === "c") {
    console.log("exit");
    break;
  }
}
