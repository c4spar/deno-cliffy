#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .option("-s, --standalone [value:boolean]", "Some standalone option.", {
    standalone: true,
  })
  .option("-o, --other [value:boolean]", "Some other option.")
  .parse(Deno.args);
