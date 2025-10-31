#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";
import { HelpCommand } from "@cliffy/command/help";

await new Command()
  .version("0.1.0")
  .description("Sample description ...")
  .env(
    "EXAMPLE_ENVIRONMENT_VARIABLE=<value:boolean>",
    "Environment variable description ...",
  )
  .command("help", new HelpCommand().global())
  .parse();
