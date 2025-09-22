#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

await new Command()
  .command("global [val:string]", "global ...")
  .global()
  .action(console.log)
  .command(
    "command1",
    new Command()
      .description("Some sub command.")
      .command(
        "command2",
        new Command()
          .description("Some nested sub command."),
      ),
  )
  .parse(Deno.args);
