#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";
import { EnumType } from "../../command/types/enum.ts";

enum Animal {
  Dog = "dog",
  Cat = "cat",
}

// Enum type with enum.
const animal = new EnumType(Animal);

// Enum type with array.
const color = new EnumType(["blue", "yellow", "red"]);

await new Command()
  .type("color", color)
  .type("animal", animal)
  .option(
    "-c, --color [name:color]",
    "Choose a color.",
  )
  .option(
    "-a, --animal [name:animal]",
    "Choose an animal.",
  )
  .action(({ color, animal }) => {
    console.log("color: %s", color);
    console.log("animal: %s", animal);
  })
  .parse(Deno.args);
