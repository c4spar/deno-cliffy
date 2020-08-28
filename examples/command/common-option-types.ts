#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

const { options } = await new Command()
  // optional boolean value
  .option("-s, --small [small:boolean]", "Small pizza size.")
  // required string value
  .option("-p, --pizza-type <type>", "Flavour of pizza.")
  // required number value
  .option("-a, --amount <amount:number>", "Pieces of pizza.")
  .parse(Deno.args);

console.log(options);
