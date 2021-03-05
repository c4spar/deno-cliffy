#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

// Define your argument types.
type Arguments = [input: string, output?: string];

// Define your option types.
interface Options {
  name: string;
  age: number;
  email?: string;
}

// Define your global option types.
interface GlobalOptions {
  debug?: boolean;
  debugLevel: "debug" | "info" | "warn" | "error";
}

await new Command<
  Options,
  Arguments,
  GlobalOptions
>()
  .arguments("<input:string> [output:string]")
  .globalOption("-d, --debug", "description ...")
  .globalOption("-l, --debug-level <string>", "description ...", {
    default: "warn",
  })
  .option("-n, --name <name:string>", "description ...", { required: true })
  .option("-a, --age <age:number>", "description ...", { required: true })
  .option("-e, --email <email:string>", "description ...")
  .action((options: Options, input: string, output?: string) => {
    /** valid options */
    options.name && options.age && options.email;
    /** invalid options */
    // @ts-expect-error option foo does not exist.
    options.foo;
  })
  .parse(Deno.args);
