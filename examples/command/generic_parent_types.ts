#!/usr/bin/env -S deno run

import { Command, EnumType } from "jsr:@cliffy/command@1.0.0-rc.8";

const colorType = new EnumType(["red", "blue"]);

const fooCommand = new Command<
  { debug?: true },
  { color: typeof colorType }
>()
  .option("-b, --bar", "...")
  .option("-c, --color <color-name:color>", "...")
  .action((options) => {
    if (options.debug) {
      console.log("debug");
    }
    if (options.bar) {
      console.log("bar");
    }
    if (options.color) {
      console.log("color", options.color);
    }
    // @ts-expect-error option foo does not exist.
    if (options.foo) {
      console.log("foo");
    }
  });

await new Command()
  .globalType("color", colorType)
  .globalOption("-d, --debug", "...")
  .command("foo", fooCommand)
  .parse(Deno.args);
