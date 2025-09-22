#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

const { args } = await new Command()
  .arguments("<input> [output:string]")
  .parse(Deno.args);

console.log(args);
