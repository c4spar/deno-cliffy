#!/usr/bin/env -S deno run

import { CompletionsCommand } from "../../command/completions/mod.ts";
import { HelpCommand } from "../../command/help/mod.ts";
import { Command } from "../../command/command.ts";

await new Command()
  .name("help-option-and-command")
  .version("0.1.0")
  .description("Sample description ...")
  .help({
    types: true,
    hints: true,
  })
  .env(
    "EXAMPLE_ENVIRONMENT_VARIABLE=<value:boolean>",
    "Environment variable description ...",
  )
  .example(
    "Some example",
    "Example content ...\n\nSome more example content ...",
  )
  .option("-f, --foo [val:number]", "Some description.", { required: true, default: 2 })
  .command("help", new HelpCommand())
  .command("completions", new CompletionsCommand())
  .parse(Deno.args);
