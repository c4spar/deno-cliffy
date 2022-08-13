#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

const { args: dirs } = await new Command()
  .description("Remove directories.")
  .arguments("<dirs...>")
  .parse(Deno.args);

for (const dir of dirs) {
  console.log("rmdir %s", dir);
}
