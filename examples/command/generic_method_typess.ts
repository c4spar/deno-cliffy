#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

new Command<void>()
  .arguments<[input: string, output?: string]>("<input> [output]")
  .globalOption<{ debug?: boolean }>("-d, --debug", "...")
  .option<{ logLevel?: boolean }>("-L, --log-level", "...", { global: true })
  .option<{ main?: boolean }>("-m, --main", "...")
  .action((options) => {
    options.debug && options.logLevel &&
      options.main;
    // @ts-expect-error foo & fooGlobal option's only exists on foo command.
    options.foo && options.fooGlobal &&
      // @ts-expect-error bar & barGlobal option's only exists on bar command.
      options.bar && options.barGlobal;
  })
  .command("foo")
  .globalOption<{ fooGlobal?: boolean }>("-F, --foo-global", "...")
  .option<{ foo?: boolean }>("-f, --foo", "...")
  .action((options) => {
    options.debug && options.logLevel &&
      options.foo && options.fooGlobal;
    // @ts-expect-error main option only exists on main command.
    options.main &&
      // @ts-expect-error bar & barGlobal option's only exists on bar command.
      options.bar && options.barGlobal;
  })
  .command("bar")
  .globalOption<{ barGlobal?: boolean }>("-B, --bar-global", "...")
  .option<{ bar?: boolean }>("-b, --bar", "...")
  .action((options) => {
    options.debug && options.logLevel &&
      options.bar && options.barGlobal;
    // @ts-expect-error main option only exists on main command.
    options.main &&
      // @ts-expect-error foo & fooGlobal option's only exists on foo command and it's child command's.
      options.foo && options.fooGlobal;
  });
