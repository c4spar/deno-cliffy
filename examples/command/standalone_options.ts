#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

await new Command()
  .option("-s, --standalone [value:boolean]", "Some standalone option.", {
    standalone: true,
  })
  .option("-o, --other [value:boolean]", "Some other option.")
  .parse(Deno.args);
