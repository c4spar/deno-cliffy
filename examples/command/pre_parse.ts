#!/usr/bin/env -S deno run

import { Command } from "../../command/mod.ts";

await new Command()
  .name("rm")
  .description("Remove directory.")
  .option("-r, --recursive", "Remove directory recursively.", {
    global: true,
  })
  .command(
    "foo",
    new Command()
      .command(
        "bar",
        new Command()
          .action((opts) => {
            console.log("opts:", opts);
          }),
      )
      .reset(),
  )
  .parse(Deno.args);
