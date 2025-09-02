#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

const { options } = await new Command()
  // Env value must be always required.
  .env("DEBUG=<debug:boolean>", "Enable debugging.")
  // Option with no value.
  .option("-d, --debug", "Enable debugging.")
  // Option with optional boolean value.
  .option("-s, --small [small:boolean]", "Small pizza size.")
  // Option with required string value.
  .option("-p, --pizza-type <type>", "Flavour of pizza.")
  // Option with required number value.
  .option("-a, --amount <amount:integer>", "Pieces of pizza.")
  // Option that hides its default value.
  .option("-t, --token <token:secret>", "Token.", { default: () => "SECRET" })
  // One required and one optional command argument.
  .arguments("<input:string> [output:string]")
  .parse(Deno.args);

console.log(options);
