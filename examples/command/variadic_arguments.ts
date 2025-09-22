#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

const { args: dirs } = await new Command()
  .description("Remove directories.")
  .arguments("<dirs...>")
  .parse(Deno.args);

for (const dir of dirs) {
  console.log("rmdir %s", dir);
}
