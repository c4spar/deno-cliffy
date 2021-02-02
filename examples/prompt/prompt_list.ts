#!/usr/bin/env -S deno run --unstable

import { tty } from "../../ansi/tty.ts";
import { prompt } from "../../prompt/prompt.ts";
import { Input } from "../../prompt/input.ts";
import { Select } from "../../prompt/select.ts";

const sig = Deno.signals.interrupt();
(async () => {
  for await (const _ of sig) {
    // tty.cursorShow();
    // console.log("\nSigint received. Exiting deno process!");
    Deno.exit(1);
  }
})();

const result = await prompt([{
  name: "configuration",
  message: "Select the Setting to Configure",
  type: Select,
  search: true,
  options: [
    "token",
    "prefix",
    "supportServerID",
    "channelIds",
    "roleIDs",
    "userIDs",
  ],
}, {
  name: "token",
  message: "Enter the Bot Token:",
  type: Input,
  before: async ({ configuration }, next) => {
    if (configuration?.includes("token")) {
      await next(); // run token prompt
    } else {
      await next(true); // skip token prompt
    }
  },
}, {
  name: "prefix",
  message: "prefix...",
  type: Input,
  before: async ({ configuration }, next) => {
    if (configuration?.includes("prefix")) {
      await next(); // run prefix prompt
    } else {
      await next(true); // skip prefix prompt
    }
  },
}], {
  cbreak: true,
});

console.log(result);

sig.dispose();
