#!/usr/bin/env -S deno run

import { Command, Type, TypeInfo, ValidationError } from "../../command/mod.ts";

class ColorType<TType extends string> extends Type<TType, string> {
  private readonly colors = ["red", "blue", "yellow"];

  public parse({ label, name, value }: TypeInfo<TType>): string {
    if (!this.colors.includes(value)) {
      throw new ValidationError(
        `${label} "${name}" must be a valid color, but got "${value}". Possible values are: ${
          this.colors.join(", ")
        }`,
      );
    }

    return value;
  }
}

const { options } = await new Command()
  .type("color", new ColorType())
  .arguments("[color-name:color]")
  .option("-c, --color <name:color>", "...")
  .command("foo [color-name:color]", "...")
  .parse(Deno.args);

console.log(options);
