#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

const { options } = await new Command()
  .option("-c, --color <color:string>", "read from file ...", { collect: true })
  .parse();

console.log(options);
