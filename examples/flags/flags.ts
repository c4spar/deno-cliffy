#!/usr/bin/env -S deno run

import { parseFlags } from "../../flags/flags.ts";

console.log(parseFlags(Deno.args, {
  flags: [{
    name: "file",
    aliases: ["foo"],
    type: "integer",
    // file cannot be combined with stdin option
    conflicts: ["stdin"],
  }],
}));
