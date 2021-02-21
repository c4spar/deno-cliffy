#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

// Define global parent option `debug`.
export const fooCommand = new Command<void, [], { debug?: boolean }>()
  // Add foo command options.
  .option<{ bar?: boolean }>("-b, --bar", "...")
  .action((options) => {
    if (options.debug) {
      console.log("debug");
    }
    if (options.bar) {
      console.log("bar");
    }
  });

await new Command<void>()
  .option<{ debug?: boolean }>("-d, --debug", "...", { global: true })
  .command("foo", fooCommand)
  .parse(Deno.args);
