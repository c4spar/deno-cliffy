#!/usr/bin/env -S deno run

import { parseFlags } from "../../flags/mod.ts";

const { flags } = parseFlags(Deno.args, {
  flags: [{
    name: "color",
    type: "string",
    collect: true,
  }],
});

console.log(flags);
