#!/usr/bin/env -S deno run -A

import { Command } from "@cliffy/command";

await new Command()
  .env("SOME_ENV_VAR=<value:number>", "Description ...")
  .action((options) => console.log(options))
  .parse();
