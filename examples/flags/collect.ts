#!/usr/bin/env -S deno run

import { parseFlags } from "jsr:@cliffy/flags@1.0.0-rc.8";

const { flags } = parseFlags(Deno.args, {
  flags: [{
    name: "color",
    type: "string",
    collect: true,
  }],
});

console.log(flags);
