#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

await new Command()
  .name("rm")
  .description("Remove directory.")
  .option("-r, --recursive=[val]", "Remove directory recursively.")
  .arguments("<dir>")
  .action(({ recursive }, dir: string) => {
    console.log("remove " + dir + (recursive ? " recursively" : ""));
  })
  .parse(Deno.args);
