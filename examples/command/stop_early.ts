#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .option("-d, --debug-level <level:string>", "Debug level.")
  .arguments("[script] [args...]")
  .stopEarly() // <-- enable stop early
  // deno-lint-ignore no-explicit-any
  .action((options: any, script: string, args: Array<string>) => {
    console.log("options:", options);
    console.log("script:", script);
    console.log("args:", args);
  })
  .parse(Deno.args);
