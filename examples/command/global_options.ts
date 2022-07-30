#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .option("-l, --local [val:string]", "Only available on this command.")
  .globalOption(
    "-g, --global [val:string]",
    "Available on this and all nested child commands.",
  )
  .action(console.log)
  .command(
    "command1",
    new Command()
      .description("Some sub command.")
      .action(console.log)
      .command(
        "command2",
        new Command()
          .description("Some nested sub command.")
          .action(console.log),
      )
      .reset(),
  )
  .parse(Deno.args);
