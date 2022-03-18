#!/usr/bin/env -S deno run -A

import { Command } from "../../command/command.ts";

await new Command()
  .env(
    "FOO_OUTPUT_FILE=<value:string>",
    "The output file.",
    { prefix: "FOO_" },
  )
  .option(
    "--output-file <value:string>",
    "The output file.",
  )
  .action((options) => console.log(options))
  .parse();
