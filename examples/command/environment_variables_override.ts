#!/usr/bin/env -S deno run -A

import { Command } from "../../command/command.ts";

await new Command()
  .env(
    "DENO_INSTALL_ROOT=<path:string>",
    "Set install root.",
    { prefix: "DENO_" },
  )
  .option(
    "--install-root <path:string>",
    "Set install root.",
  )
  .action((options) => console.log(options))
  .parse();
