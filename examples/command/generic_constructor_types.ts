#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";
import type { IParseResult } from "../../command/types.ts";

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
  debugLevel?: string;
}

const result: IParseResult<Options, Arguments, GlobalOptions> =
  await new Command<
    Options,
    Arguments,
    GlobalOptions
  >()
    .arguments("<input:string> [output:string]")
    .globalOption("-d, --debug", "description ...")
    .option("-l, --debug-level <string>", "description ...", { global: true })
    .option("-n, --name <name:string>", "description ...", { required: true })
    .option("-a, --age <age:number>", "description ...", { required: true })
    .option("-e, --email <email:string>", "description ...")
    .action((options: Options, input: string, output?: string) => {})
    .action((options) => {
      /** valid options */
      options.name && options.age &&
        options.email;
      /** invalid options */
      // @ts-expect-error option foo does not exist.
      options.foo;
    })
    .parse(Deno.args);

const options: Options = result.options;
const input: string = result.args[0];
const output: string | undefined = result.args[1];
