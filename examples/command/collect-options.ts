#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

const { options } = await new Command()
  .option("-c, --color <color:string>", "read from file ...", { collect: true })
  .parse(Deno.args);

console.log(options);
