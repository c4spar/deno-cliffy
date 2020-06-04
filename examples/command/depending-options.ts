#!/usr/bin/env -S deno run

import { Command } from "../../packages/command/lib/command.ts";

const { options } = await new Command()
  .option("-a, --audio-codec <type:string>", "description ...")
  .option(
    "-v, --video-codec <type:string>",
    "description ...",
    { depends: ["audio-codec"] },
  )
  .parse(Deno.args);

console.log(options);
