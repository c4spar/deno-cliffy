#!/usr/bin/env -S deno run

import { HelpCommand } from "../../command/help/help_command.ts";
import { Command } from "../../command/command.ts";

await new Command()
  .version("0.1.0")
  .description("Sample description ...")
  .env(
    "EXAMPLE_ENVIRONMENT_VARIABLE=<value:boolean>",
    "Environment variable description ...",
  )
  .command("help", new HelpCommand().global())
  .parse(Deno.args);
