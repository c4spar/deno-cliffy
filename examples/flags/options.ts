#!/usr/bin/env -S deno run

import { parseFlags } from "jsr:@cliffy/flags@1.0.0-rc.8";

const { flags } = parseFlags(Deno.args, {
  flags: [{
    name: "help",
    aliases: ["h"],
    standalone: true,
  }, {
    name: "verbose",
    aliases: ["v"],
    collect: true,
    value: (val: boolean, previous = 0) => val ? previous + 1 : 0,
  }, {
    name: "file",
    aliases: ["f"],
    type: "string",
  }],
});

console.log(flags);
