#!/usr/bin/env -S deno run --unstable

import { tty } from "../../ansi/tty.ts";
import { Toggle } from "../../prompt/toggle.ts";

const sig = Deno.signals.interrupt();
(async () => {
  for await (const _ of sig) {
    tty.cursorShow();
    console.log("\nSigint received. Exiting deno process!");
    Deno.exit(1);
  }
})();

const confirmed: boolean = await Toggle.prompt({
  message: "Please confirm",
  cbreak: true,
});

console.log({ confirmed });

sig.dispose();
