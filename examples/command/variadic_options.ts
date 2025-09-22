#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

const { options } = await new Command()
  .version("0.1.0")
  .option("-d, --dir [otherDirs...:string]", "Variadic option.")
  .parse(Deno.args);

console.log(options);
