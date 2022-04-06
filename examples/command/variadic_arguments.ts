#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

const { args } = await new Command()
  .description("Remove directories.")
  .arguments("<dirs...>")
  .parse(Deno.args);

const dirs = args[0];

for (const dir of dirs) {
  console.log("rmdir %s", dir);
}
