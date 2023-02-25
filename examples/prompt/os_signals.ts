#!/usr/bin/env -S deno run

import { tty } from "../../ansi/tty.ts";
import { Toggle } from "../../prompt/toggle.ts";

Deno.addSignalListener("SIGINT", () => {
  tty.cursorLeft.eraseDown.cursorShow();
  console.log("interrupted!");
  Deno.exit(1);
});

const confirmed: boolean = await Toggle.prompt({
  message: "Please confirm",
  cbreak: true,
});

console.log({ confirmed });
