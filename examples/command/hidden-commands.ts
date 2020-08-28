#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .command("top-secret", "Nobody knows about me!")
  .hidden()
  .parse(Deno.args);
