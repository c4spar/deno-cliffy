#!/usr/bin/env -S deno run

import { Command } from "../../command/mod.ts";

await new Command()
  .command("rm <dir>", "Remove directory.")
  .option("-r, --recursive [recursive:boolean]", "Remove recursively")
  // deno-lint-ignore no-explicit-any no-undef
  .action(({ recursive }: any, dir: string) => {
    console.log("remove " + dir + (recursive ? " recursively" : ""));
  })
  .parse(Deno.args);
