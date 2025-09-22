#!/usr/bin/env -S deno run --allow-net --allow-run --allow-read --no-check

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";
import { CompletionsCommand } from "jsr:@cliffy/command@1.0.0-rc.8/completions";
import { UpgradeCommand } from "jsr:@cliffy/command@1.0.0-rc.8/upgrade";
import { DenoLandProvider } from "jsr:@cliffy/command@1.0.0-rc.8/upgrade/provider/deno-land";
import { GithubProvider } from "jsr:@cliffy/command@1.0.0-rc.8/upgrade/provider/github";
import { NestLandProvider } from "jsr:@cliffy/command@1.0.0-rc.8/upgrade/provider/nest-land";

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
