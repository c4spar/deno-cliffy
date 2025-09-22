#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

const { options } = await new Command()
  // default value will be automatically set to true if no --check option exists
  .option("--no-check", "No check.")
  .option("--color <color:string>", "Color name.", { default: "yellow" })
  .option("--no-color", "No color.")
  // no default value
  .option("--remote <url:string>", "Remote url.")
  .option("--no-remote", "No remote.")
  .parse(Deno.args);

console.log(options);
