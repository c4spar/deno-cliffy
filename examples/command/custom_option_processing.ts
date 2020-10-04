#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

const { options } = await new Command()
  .option(
    "-o, --object <item:string>",
    "map string to object",
    (value: string): { value: string } => {
      return { value };
    },
  )
  .option("-C, --color <item:string>", "collect colors", {
    collect: true,
    value: (value: string, previous: string[] = []): string[] => {
      if (["blue", "yellow", "red"].indexOf(value) === -1) {
        throw new Error(
          `Color must be one of blue, yellow or red but got: ${value}`,
        );
      }
      previous.push(value);
      return previous;
    },
  })
  .parse(Deno.args);

console.log(options);
