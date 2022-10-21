#!/usr/bin/env -S deno run

import { ArgumentValue, Command } from "../../command/mod.ts";

const colors = ["red", "blue", "yellow"];

function colorType({ label, name, value }: ArgumentValue): string {
  if (!colors.includes(value.toLowerCase())) {
    throw new Error(
      `${label} "${name}" must be a valid color, but got "${value}". Possible values are: ${
        colors.join(", ")
      }`,
    );
  }

  return value;
}

const { options } = await new Command()
  .type("color", colorType)
  .arguments("[color-name:color]")
  .option("-c, --color <name:color>", "...")
  .command("foo [color-name:color]", "...")
  .parse(Deno.args);

console.log(options);
