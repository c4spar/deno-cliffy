#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";
import { red } from "jsr:@stdfmt^1.0.8/colors";

await new Command()
  .name("examples")
  .example(
    "example name",
    `Description ...\n\nCan have multiple lines and ${red("colors")}.`,
  )
  .parse(Deno.args);
