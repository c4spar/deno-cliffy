#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

await new Command()
  .name("cliffy")
  .version("0.1.0")
  .description(`Command line framework for Deno`)
  .parse(Deno.args);
