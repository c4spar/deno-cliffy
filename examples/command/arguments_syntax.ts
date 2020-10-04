#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

const { args } = await new Command()
  .arguments("<cmd> [env]")
  .parse(Deno.args);

console.log(args);
