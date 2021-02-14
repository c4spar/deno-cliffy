#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command<void>()
  .arguments<[input: string, output?: string]>("<input:string> [output:string]")
  .option<{ name: string }>("-n, --name <name:string>", "description ...", {
    required: true,
  })
  .option<{ age: number }>("-a, --age <age:number>", "description ...", {
    required: true,
  })
  .option<{ email?: string }>("-e, --email <email:string>", "description ...")
  .action((options, input, output?) => {})
  .parse(Deno.args);
