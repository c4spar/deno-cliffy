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
