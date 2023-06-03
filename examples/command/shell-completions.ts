#!/usr/bin/env deno run

import { Command } from "../../command/command.ts";
import { CompletionsCommand } from "../../command/completions/completions_command.ts";

await new Command()
  .throwErrors()
  .name("cliffy")
  .version("0.1.0")
  // completions
  .complete("verbose", () => ["1", "2", "3"], { global: true })
  // options
  .option(
    "-v, --verbose <verbosity:number:verbose>",
    "Increase verbosity.",
    // deno-lint-ignore no-inferrable-types
    { global: true, value: (cur, prev: number = 0) => prev + cur },
  )
  .option(
    "-s, --silent <val:string:my-type>",
    "Disable output.",
    { global: true },
  )
  // animal command
  .command("animal <animal:string:animal>", "Select an animal.")
  .complete("animal", () => ["dog", "cat", "dino"])
  .action((_, animal: string) => console.log(animal))
  // country command
  .command("country <country:string:country>", "Select a country.")
  .complete("country", () => ["germany", "spain", "indonesia"])
  .action((_, country: string) => console.log(country))
  // car command
  .command(
    "car",
    new Command()
      .description("Select a car.")
      .complete("color", () => ["Black", "Red", "Yellow"])
      .option(
        "-c, --color <color:string:color>",
        "other description...",
        { global: true },
      )
      .command("audi <model:string:audi>")
      .complete("audi", () => ["R8", "R7"])
      .action(({ color }, model: string) => console.log({ color, model }))
      .command("bmw <model:string:bmw>")
      .complete("bmw", () => ["8er", "7er"])
      .action(({ color }, model: string) => console.log({ color, model }))
      .command("porsche <model:string:porsche>")
      .complete("porsche", () => ["911 GT3 RS", "718 Spyder"])
      .action(({ color }, model: string) => console.log({ color, model }))
      .reset(),
  )
  .command("completions", new CompletionsCommand())
  .parse();
