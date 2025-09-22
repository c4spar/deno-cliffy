#!/usr/bin/env -S deno run

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

const { options } = await new Command()
  .option(
    "-b.a, --bitrate.audio, --audio-bitrate <bitrate:number>",
    "Audio bitrate",
  )
  .option(
    "-b.v, --bitrate.video, --video-bitrate <bitrate:number>",
    "Video bitrate",
  )
  .parse();

console.log(options);
