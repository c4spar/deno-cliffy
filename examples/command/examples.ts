#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";
import { red } from "@std/fmt/colors";

await new Command()
  .name("examples")
  .example(
    "example name",
    `Description ...\n\nCan have multiple lines and ${red("colors")}.`,
  )
  .parse();
