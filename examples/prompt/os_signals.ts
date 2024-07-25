#!/usr/bin/env -S deno run

import { tty } from "@cliffy/ansi/tty";
import { Toggle } from "@cliffy/prompt/toggle";

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
