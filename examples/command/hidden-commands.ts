#!/usr/bin/env -S deno run

import { Command } from "../../packages/command/lib/command.ts";

await new Command()
  .command("top-secret", "Nobody knows about me!")
  .hidden()
  .parse(Deno.args);
