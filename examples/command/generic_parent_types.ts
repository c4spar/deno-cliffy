#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";
import { EnumType } from "../../command/types/enum.ts";

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
