#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

await new Command()
  .option("-d, --debug-level <level:string>", "Debug level.")
  .arguments("[script] [...args]")
  .stopEarly() // <-- enable stop early
  .action((options, script?: string, ...args: Array<string>) => {
    console.log("options:", options);
    console.log("script:", script);
    console.log("args:", args);
  })
  .parse(Deno.args);
