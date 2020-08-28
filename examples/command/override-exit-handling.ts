#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

try {
  await new Command()
    .throwErrors()
    .option("-p, --pizza-type <type>", "Flavour of pizza.")
    .parse(Deno.args);
} catch (err) {
  // custom processing...
  console.error("[CUSTOM_ERROR]", err);
}
