#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";
import { EnumType } from "../../command/types/enum.ts";

const color = new EnumType(["blue", "yellow", "red"]);

await new Command<void>()
  .type("color", color)
  .option<{ color: typeof color }>(
    "-c, --color [value:color]",
    "choose a color",
  )
  .action(({ color }) => {
    console.log("color: %s", color);
  })
  .parse(Deno.args);
