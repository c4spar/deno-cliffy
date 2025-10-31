#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

await new Command()
  .command("top-secret", "Nobody knows about me!")
  .hidden()
  .parse();
