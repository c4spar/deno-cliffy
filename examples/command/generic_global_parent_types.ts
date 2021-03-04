#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

// Define global parent option `debug`.
export const fooCommand = new Command<void, [], void, { debug?: boolean }>()
  // Add foo command options.
  .option<{ bar?: boolean }>("-b, --bar", "...")
  // .requiredOption<{ baz?: boolean }>("-b, --bar", "...")
  .globalOption<{ baz?: boolean }>("-b, --bar", "...")
  .action((options) => {
    if (options.debug) {
      console.log("debug");
    }
    if (options.debug2) {
      console.log("debug2");
    }
    if (options.bar) {
      console.log("bar");
    }
  })
  .command("foo")
  .option<{ bab?: boolean }>("", "")
  .reset();

await new Command<void>()
  .option<{ debug?: boolean }>("-d, --debug", "...", { global: true })
  .command("foo", fooCommand)
  // .action((options) => {
  //   if (options.debug) {
  //     console.log("debug");
  //   }
  //   if (options.debug2) {
  //     console.log("debug2");
  //   }
  //   if (options.bar) {
  //     console.log("bar");
  //   }
  // })
  .parse(Deno.args);
