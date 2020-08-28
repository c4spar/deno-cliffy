#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

const { options } = await new Command()
  .option("-c, --cheese [type:string]", "add the specified type of cheese", {
    default: "blue",
  })
  .parse(Deno.args);

console.log(`cheese: ${options.cheese}`);
