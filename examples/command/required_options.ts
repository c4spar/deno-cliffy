#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

await new Command()
  .allowEmpty(false)
  .option("-c, --cheese [type:string]", "pizza must have cheese", {
    required: true,
  })
  .parse(Deno.args);
