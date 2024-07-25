#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

await new Command()
  .option("-H, --hidden [hidden:boolean]", "Nobody knows about me!", {
    hidden: true,
  })
  .parse(Deno.args);
