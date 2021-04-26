#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .option(
    "-c, --color <color:string>",
    "choose a color",
    /^(blue|yellow|red)$/,
  )
  .action((options) => {
    console.log(options);
  })
  .parse();
