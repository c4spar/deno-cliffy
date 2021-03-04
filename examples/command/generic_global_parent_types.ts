#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

// Define global parent option `debug`.
const fooCommand = new Command<void, [], void, { debug?: boolean }>()
  // Add foo command options.
  .option<{ bar?: boolean }>("-b, --bar", "...")
  .action((options) => {
    if (options.debug) {
      console.log("debug");
    }
    if (options.bar) {
      console.log("bar");
    }
    // @ts-expect-error option foo does not exist.
    if (options.foo) {
      console.log("foo");
    }
  });

await new Command<void>()
  // Add global option.
  .globalOption<{ debug?: boolean }>("-d, --debug", "...")
  .command("foo", fooCommand)
  .parse(Deno.args);
