#!/usr/bin/env -S deno run

import { tty } from "jsr:@cliffy/ansi@1.0.0-rc.8/tty";
import { Toggle } from "jsr:@cliffy/command@1.0.0-rc.8/toggle";

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
