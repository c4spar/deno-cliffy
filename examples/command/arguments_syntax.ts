#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

const { args } = await new Command()
  .arguments("<input> [output:string]")
  .parse(Deno.args);

console.log(args);
