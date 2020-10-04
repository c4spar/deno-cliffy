#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .version("0.1.0")
  .parse(Deno.args);
