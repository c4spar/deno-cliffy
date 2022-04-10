#!/usr/bin/env -S deno run

import { Command, ValidationError } from "../../command/mod.ts";

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
    value: (value: string, previous: Array<string> = []): Array<string> => {
      if (["blue", "yellow", "red"].indexOf(value) === -1) {
        throw new ValidationError(
          `Color must be one of "blue, yellow or red", but got "${value}".`,
          // optional you can set the exitCode which is used if .throwErrors()
          // is not called. Default is: 1
          { exitCode: 1 },
        );
      }
      previous.push(value);
      return previous;
    },
  })
  .parse(Deno.args);

console.log(options);
