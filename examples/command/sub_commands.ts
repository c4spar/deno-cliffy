#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

// Sub-command implemented using action handler (description is supplied separately to `.command()`)
await new Command()
  .command(
    "clone <source:string> [destination:string]",
    "Clone a repository into a newly created directory.",
  )
  .action((_, source: string, destination?: string) => {
    console.log("clone: %s -> %s", source, destination);
  })
  .parse(Deno.args);

// Sub-command implemented using a command instance as second parameter.
await new Command()
  .command(
    "clone",
    new Command()
      .arguments("<source:string> [destination:string]")
      .description("Clone a repository into a newly created directory.")
      .action((_, source: string, destination?: string) => {
        console.log("clone: %s -> %s", source, destination);
      }),
  )
  .parse(Deno.args);

// Command implemented using separate executable file (description is passed as second parameter to `.command()`)
await new Command()
  .command("start <service>", "Start named service.").executable()
  .command("stop [service]", "Stop named service, or all if no name supplied.")
  .executable()
  .parse(Deno.args);
