#!/usr/bin/env -S deno run

import { Command } from "../../packages/command/lib/command.ts";

await new Command()
  .version("0.1.0")
  .option("-l, --local [val:string]", "Only available on this command.")
  .option(
    "-g, --global [val:string]",
    "Available on this and all nested child command's.",
    { global: true },
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
      ),
  )
  .parse(Deno.args);
