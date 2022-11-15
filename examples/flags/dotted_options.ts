#!/usr/bin/env -S deno run

import { parseFlags } from "../../flags/flags.ts";

const result = parseFlags(Deno.args, {
  allowEmpty: true,
  stopEarly: true,
  flags: [{
    name: "bitrate.audio",
    aliases: ["b.a", "audio-bitrate"],
    type: "number",
  }, {
    name: "bitrate.video",
    aliases: ["b.v", "video-bitrate"],
    type: "number",
  }],
});

console.log(result);
