#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

const { options } = await new Command()
  .option("-u, --audio-codec <type:string>", "description ...")
  .option("-p, --video-codec <type:string>", "description ...", {
    depends: ["audio-codec"],
  })
  .parse(Deno.args);

console.log(options);
