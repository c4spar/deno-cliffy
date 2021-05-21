#!/usr/bin/env -S deno run --allow-net --allow-run --allow-read --no-check

import { Command, CompletionsCommand } from "../../command/mod.ts";
import {
  DenoLandProvider,
  NestLandProvider,
  UpgradeCommand,
} from "../../command/upgrade/mod.ts";
import { GithubProvider } from "../../command/upgrade/provider/github.ts";

await new Command()
  .name("codeview")
  .version("0.2.2")
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
