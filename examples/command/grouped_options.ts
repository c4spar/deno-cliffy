#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .version("0.1.0")
  .description("Grouped options example.")
  .option("--foo", "Foo option.")
  .group("Other options")
  .option("--bar", "Bar option.")
  .option("--baz", "Baz option.")
  .group("Other options 2")
  .option("--beep", "Beep option.")
  .option("--boop", "Boop option.")
  .parse(Deno.args);
