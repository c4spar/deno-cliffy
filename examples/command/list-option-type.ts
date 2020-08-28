#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

const { options } = await new Command()
  // comma separated list
  .option("-l, --list <items:number[]>", "comma separated list of numbers.")
  // space separated list
  .option(
    "-o, --other-list <items:string[]>",
    "space separated list of strings.",
    { separator: " " },
  )
  .parse(Deno.args);

console.log(options);
