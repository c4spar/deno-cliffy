#!/usr/bin/env -S deno run

import { OptionType } from "../../flags/deprecated.ts";
import { parseFlags } from "../../flags/flags.ts";

const result = parseFlags(Deno.args, {
  allowEmpty: true,
  stopEarly: true,
  flags: [{
    name: "bitrate.audio",
    aliases: ["b.a", "audio-bitrate"],
    type: OptionType.NUMBER,
  }, {
    name: "bitrate.video",
    aliases: ["b.v", "video-bitrate"],
    type: OptionType.NUMBER,
  }],
});

console.log(result);
