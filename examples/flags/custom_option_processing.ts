#!/usr/bin/env -S deno run

import { ArgumentValue, parseFlags } from "jsr:@cliffy/flags@1.0.0-rc.8";

const result = parseFlags(Deno.args, {
  flags: [{
    name: "foo",
    type: "float",
  }],
  parse: ({ label, name, value, type }: ArgumentValue) => {
    switch (type) {
      case "float":
        if (isNaN(Number(value))) {
          throw new Error(
            `${label} "${name}" must be of type "${type}", but got "${value}".`,
          );
        }
        return parseFloat(value);
      default:
        throw new Error(`Unknown type "${type}".`);
    }
  },
});

console.log(result);
