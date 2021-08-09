#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command<void>()
  .env<{ someEnvVar: number }>(
    "SOME_ENV_VAR=<value:number>",
    "Description ...",
    {
      global: true,
      hidden: false,
      required: true,
    },
  )
  .action((options) => console.log(options.someEnvVar))
  .command("hello", "world ...")
  .parse(Deno.args);

console.log(Deno.env.get("SOME_ENV_VAR"));
