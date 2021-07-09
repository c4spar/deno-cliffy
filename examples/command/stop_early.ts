#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .stopEarly() // <-- enable stop early
  .option("-d, --debug-level <level:string>", "Debug level.")
  .arguments("[script:string] [...args:string]")
  // deno-lint-ignore no-explicit-any
  .action((options: any, script: string, args: string[]) => {
    console.log("options:", options);
    console.log("script:", script);
    console.log("args:", args);
  })
  .parse(Deno.args);
