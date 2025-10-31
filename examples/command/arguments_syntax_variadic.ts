#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

await new Command()
  .command("rmdir <dirs...:string>", "Remove directories.")
  .action((_, ...dirs: [string, ...Array<string>]) => {
    dirs.forEach((dir: string) => {
      console.log("rmdir %s", dir);
    });
  })
  .parse();
