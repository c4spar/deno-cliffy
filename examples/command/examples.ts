#!/usr/bin/env -S deno run

import { red } from "https://deno.land/std@0.196.0/fmt/colors.ts";
import { Command } from "../../command/command.ts";

await new Command()
  .name("examples")
  .example(
    "example name",
    `Description ...\n\nCan have multiple lines and ${red("colors")}.`,
  )
  .parse(Deno.args);
