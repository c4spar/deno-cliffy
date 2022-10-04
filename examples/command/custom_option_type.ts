#!/usr/bin/env -S deno run

import { Command, FlagArgumentTypeInfo } from "../../command/mod.ts";

const colors = ["red", "blue", "yellow"];

function colorType<TType extends string>(
  { label, name, value }: FlagArgumentTypeInfo<TType>,
): string {
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
