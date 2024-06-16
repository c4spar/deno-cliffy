#!/usr/bin/env -S deno run --allow-net --allow-run --allow-read --no-check

import { CompletionsCommand } from "../../command/completions/mod.ts";
import { Command } from "../../command/mod.ts";
import { UpgradeCommand } from "../../command/upgrade/mod.ts";
import { DenoLandProvider } from "../../command/upgrade/provider/deno_land.ts";
import { GithubProvider } from "../../command/upgrade/provider/github.ts";
import { NestLandProvider } from "../../command/upgrade/provider/nest_land.ts";

await new Command()
  .name("codeview")
  .version("0.2.1")
  .command(
    "upgrade",
    new UpgradeCommand({
      main: "codeview.ts",
      args: ["--allow-all", "--unstable"],
      provider: [
        new DenoLandProvider(),
        new NestLandProvider(),
        new GithubProvider({ repository: "c4spar/deno-codeview" }),
      ],
    }),
  )
  .command("completions", new CompletionsCommand())
  .parse();
