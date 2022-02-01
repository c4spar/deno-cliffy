#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";
import { EnumType } from "../../command/types/enum.ts";

// Enum enum type
enum Animal {
  Dog = "dog",
  Cat = "cat",
}

// Array enum type
const color = new EnumType(["blue", "yellow", "red"]);

// Array enum type
const animal = new EnumType(Animal);

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
