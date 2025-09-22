#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

await new Command()
  .command("rmdir <dirs...:string>", "Remove directories.")
  .action((_, ...dirs: [string, ...Array<string>]) => {
    dirs.forEach((dir: string) => {
      console.log("rmdir %s", dir);
    });
  })
  .parse(Deno.args);
