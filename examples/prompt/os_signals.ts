#!/usr/bin/env -S deno run --unstable

import { tty } from "../../ansi/tty.ts";
import { Input } from "../../prompt/input.ts";

const sig = Deno.signal(Deno.Signal.SIGINT);
(async () => {
  for await (const _ of sig) {
    tty.cursorShow();
    console.log("\nSigint received. Exiting deno process!");
    sig.dispose();
    Deno.exit(1);
  }
})();

const value: string = await Input.prompt({
  message: "Enter some value",
  cbreak: true,
});

console.log({ value });

sig.dispose();
