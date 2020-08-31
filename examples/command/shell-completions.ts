#!/usr/bin/env deno run

import { Command } from "../../command/command.ts";
import { CompletionsCommand } from "../../command/completions/mod.ts";

await new Command()
  .throwErrors()
  .name("cliffy")
  .version("0.1.0")
  .complete("my-type", () => ["foo", "bar"], { global: true })
  .complete("my-second-type", () => ["beep", "boop"], { global: true })
  .option("-t, --test <val:string:my-type>", "test description...")
  .command("cmd1 <arg1:string:my-type>", "cmd1 ...")
  .command("cmd2 <arg1:string:my-second-type>", "cmd2 ...")
  .command(
    "cmd3",
    new Command()
      .description("cmd3 ...")
      .option(
        "-o, --other <val1:string:my-type> <val2:string:my-second-type>",
        "other description...",
      )
      .command("cmd4 <arg1:string:my-type> <arg2:string:my-second-type>"),
  )
  .command("completions", new CompletionsCommand())
  .parse();
