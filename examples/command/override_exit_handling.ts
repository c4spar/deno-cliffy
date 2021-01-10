#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";
import { ValidationError } from "../../flags/mod.ts";

try {
  await new Command()
    .throwErrors()
    .option("-p, --pizza-type <type>", "Flavour of pizza.")
    .action(() => {
      throw new Error("Some error happened.");
    })
    .parse(Deno.args);
} catch (error) {
  // custom error handling...
  if (error instanceof ValidationError) {
    console.error("[CUSTOM_VALIDATION_ERROR]", error.message);
  } else {
    console.error("[CUSTOM_ERROR]", error);
  }
}
