#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

await new Command()
  .option("-H, --hidden [hidden:boolean]", "Nobody knows about me!", {
    hidden: true,
  })
  .parse(Deno.args);
