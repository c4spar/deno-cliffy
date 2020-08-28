#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .allowEmpty(false)
  .option("-c, --cheese [type:string]", "pizza must have cheese", {
    required: true,
  })
  .parse(Deno.args);
