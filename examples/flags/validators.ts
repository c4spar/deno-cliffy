#!/usr/bin/env -S deno run

import { parseFlags } from "../../flags/flags.ts";
import { OptionType } from "../../flags/types.ts";

const result = parseFlags(Deno.args, {
  flags: [{
    name: "function",
    aliases: ["f"],
    type: OptionType.STRING,
    optionalValue: true,
    // if collect is enabled, the previous value will be passed to the value method.
    collect: true,
    // Function validator can be used:
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
        `Option "--function" must be one of "foo", "bar" or "baz", but got "${value}".`,
      );
    },
  }, {
    name: "array",
    aliases: ["a"],
    type: OptionType.STRING,
    optionalValue: true,
    // Use array validator to allow only provided values.
    value: ["foo", "bar", "baz"],
  }, {
    name: "regex",
    aliases: ["r"],
    type: OptionType.STRING,
    optionalValue: true,
    // Use regex validator to allow only provided values.
    value: /^(foo|bar|baz)$/,
  }],
});

console.log(result);
