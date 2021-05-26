#!/usr/bin/env -S deno run

import { parseFlags } from "../../flags/flags.ts";
import { OptionType } from "../../flags/types.ts";

const result = parseFlags(Deno.args, {
  flags: [{
    name: "value",
    aliases: ["v"],
    type: OptionType.STRING,
    // if collect is enabled, previous values are passed to the value method.
    collect: true,
    // Value handler can be used:
    //   * to allow only provided values
    //   * to collect multiple options with the same name if collect is enabled
    //   * and to map the value to any other value.
    value(value: string, previous: Array<string>): Array<string> | undefined {
      // allow only foo, bar and baz as value
      if (["foo", "bar", "baz"].includes(value)) {
        // Collect and return current and previous values.
        return [...previous, value];
      }
      // if no value is returned, a default validation error will be thrown.
      // For a more detailed error message you can throw a custom ValidationError.
      throw new Error(
        `Option "--value" must be one of "foo", "bar" or "baz", but got "${value}".`,
      );
    },
  }],
});

console.log(result);
