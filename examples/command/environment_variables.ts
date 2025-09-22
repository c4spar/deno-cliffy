#!/usr/bin/env -S deno run -A

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

await new Command()
  .env("SOME_ENV_VAR=<value:number>", "Description ...")
  .action((options) => console.log(options))
  .parse(Deno.args);
