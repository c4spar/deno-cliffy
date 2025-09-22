#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

await new Command()
  .command("top-secret", "Nobody knows about me!")
  .hidden()
  .parse(Deno.args);
