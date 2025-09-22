#!/usr/bin/env -S deno run

import { parseFlags } from "jsr:@cliffy/flags@1.0.0-rc.8";

const { flags } = parseFlags(Deno.args, {
  stopEarly: true,
  flags: [{
    name: "silent",
  }, {
    name: "port",
    type: "number",
    default: 8080,
  }, {
    name: "host",
    aliases: ["hostname"],
    type: "string",
    default: "localhost",
  }, {
    name: "verbose",
    aliases: ["v"],
    collect: true,
    value: (_, verbose = 0) => ++verbose,
  }],
});

console.log("Parsed flags: %O", flags);
