#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

await new Command()
  .version("0.1.0")
  .parse(Deno.args);
