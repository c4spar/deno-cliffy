#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

const { options } = await new Command()
  .option("-u, --audio-codec <type:string>", "description ...")
  .option("-p, --video-codec <type:string>", "description ...", {
    depends: ["audio-codec"],
  })
  .parse();

console.log(options);
