#!/usr/bin/env -S deno run

import { parseFlags } from "../../flags/flags.ts";
import { OptionType } from "../../flags/types.ts";

console.log(parseFlags(Deno.args, {
  flags: [{
    name: "file",
    aliases: ["foo"],
    type: OptionType.INTEGER,
    // file cannot be combined with stdin option
    conflicts: ["stdin"],
  }],
}));
