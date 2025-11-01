#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

const { args: dirs } = await new Command()
  .description("Remove directories.")
  .arguments("<dirs...>")
  .parse();

for (const dir of dirs) {
  console.log("rmdir %s", dir);
}
