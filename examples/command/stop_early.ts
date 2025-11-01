#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

await new Command()
  .option("-d, --debug-level <level:string>", "Debug level.")
  .arguments("[script] [...args]")
  .stopEarly() // <-- enable stop early
  .action((options, script?: string, ...args: Array<string>) => {
    console.log("options:", options);
    console.log("script:", script);
    console.log("args:", args);
  })
  .parse();
