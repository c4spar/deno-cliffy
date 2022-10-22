#!/usr/bin/env -S deno run

import { OptionType } from "../../flags/deprecated.ts";
import { parseFlags } from "../../flags/flags.ts";

console.log(parseFlags(Deno.args, {
  flags: [{
    name: "file",
    aliases: ["foo"],
    type: OptionType.INTEGER,
    // file cannot be combined with stdin option
    conflicts: ["stdin"],
  }],
}));
