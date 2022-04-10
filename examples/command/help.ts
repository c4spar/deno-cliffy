#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .name("help-option-and-command")
  .version("0.1.0")
  .description("Sample description ...")
  .env(
    "EXAMPLE_ENVIRONMENT_VARIABLE=<value:boolean>",
    "Environment variable description ...",
  )
  .example(
    "Some example",
    "Example content ...\n\nSome more example content ...",
  )
  .parse(Deno.args);
