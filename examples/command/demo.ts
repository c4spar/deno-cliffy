#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";
import { CompletionsCommand } from "@cliffy/command/completions";
import { HelpCommand } from "@cliffy/command/help";

await new Command()
  .name("cliffy")
  .version("1.0.0")
  .description(`Command line framework for Deno`)
  .option("-p, --beep", "Some option.", {
    default: true,
  })
  .option("--no-beep", "Negate beep.")
  .option("-f, --foo [value:string]", "Some string value.", {
    default: "foo",
  })
  .option("-b, --bar [value:number]", "Some numeric value.", {
    default: 89,
    depends: ["foo"],
  })
  .option("-B, --baz <value:boolean>", "Some boolean value.", {
    conflicts: ["beep"],
  })
  .command("help", new HelpCommand().global())
  .command("completions", new CompletionsCommand())
  .parse();
