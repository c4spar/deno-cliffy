#!/usr/bin/env -S deno run

import { parseFlags, ValidationError } from "../../flags/mod.ts";

const { flags } = parseFlags(Deno.args, {
  flags: [{
    name: "color",
    type: "string",
    collect: true,
    value(value: string, previous: Array<string>): Array<string> | undefined {
      if (["foo", "bar", "baz"].includes(value)) {
        return [...previous, value];
      }
      // if no value is returned, a default validation error will be thrown.
      // You can use the `ValidationError` to provide a custom error message.
      throw new ValidationError(
        `Option "--value" must be one of "foo", "bar" or "baz", but got "${value}".`,
      );
    },
  }],
});

console.log(flags);
