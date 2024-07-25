#!/usr/bin/env -S deno run

import { Command, EnumType } from "@cliffy/command";

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
