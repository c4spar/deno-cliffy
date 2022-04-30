#!/usr/bin/env -S deno run

import { Command } from "../../command/mod.ts";

await new Command()
  .name("rm")
  .description("Remove directory.")
  .option("-r, --recursive=[val]", "Remove directory recursively.")
  .arguments("<dir>")
  .action(({ recursive }, dir: string) => {
    console.log("remove " + dir + (recursive ? " recursively" : ""));
  })
  .parse(Deno.args);
