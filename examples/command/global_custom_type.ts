#!/usr/bin/env -S deno run

import { Command, EnumType } from "@cliffy/command";

await new Command()
  .globalType("color", new EnumType(["red", "blue", "yellow"]))
  .command("foo", "...")
  .option("-c, --color <name:color>", "Chose a color.")
  .action(console.log)
  .command("bar", "...")
  .option("-b, --background-color [name:color]", "Choose a background color.")
  .action(console.log)
  .parse(Deno.args);
