#!/usr/bin/env -S deno run

import { parseFlags } from "../../flags/flags.ts";
import { OptionType } from "../../flags/types.ts";

const result = parseFlags(Deno.args, {
  allowEmpty: true,
  stopEarly: true,
  flags: [{
    name: "help",
    aliases: ["h"],
    // a standalone option cannot be combined with other options
    standalone: true,
  }, {
    name: "verbose",
    aliases: ["v"],
    // allow to define this option multiple times on the command line
    collect: true,
    // make --verbose incremental: turn value into an number and increase the value for each --verbose option
    value: (val: boolean, previous = 0) => val ? previous + 1 : 0,
  }, {
    name: "debug",
    aliases: ["d"],
    type: OptionType.BOOLEAN,
    optionalValue: true,
  }, {
    name: "silent",
    aliases: ["s"],
  }, {
    name: "amount",
    aliases: ["n"],
    type: OptionType.NUMBER,
    requiredValue: true,
  }, {
    name: "file",
    aliases: ["f"],
    type: OptionType.STRING,
    // file cannot be combined with stdin option
    conflicts: ["stdin"],
  }, {
    name: "stdin",
    aliases: ["i"],
    // stdin cannot be combined with file option
    conflicts: ["file"],
  }],
});

console.log(result);
