#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

const { args } = await new Command()
  .arguments("<input> [output:string]")
  .parse();

console.log(args);
