#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .name("cliffy")
  .version("0.1.0")
  .description(`Command line framework for Deno`)
  .parse(Deno.args);
