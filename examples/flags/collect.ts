#!/usr/bin/env -S deno run

import { parseFlags } from "@cliffy/flags";

const { flags } = parseFlags(Deno.args, {
  flags: [{
    name: "color",
    type: "string",
    collect: true,
  }],
});

console.log(flags);
