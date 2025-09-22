#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

const { options } = await new Command()
  .option("-f, --file <file:string>", "read from file ...")
  .option("-i, --stdin [stdin:boolean]", "read from stdin ...", {
    conflicts: ["file"],
  })
  .parse(Deno.args);

console.log(options);
