import { assertEquals, assertThrows } from "../../../dev_deps.ts";
import { OptionType } from "../../deprecated.ts";
import { parseFlags } from "../../flags.ts";
import type { ParseFlagsOptions } from "../../types.ts";

const options: ParseFlagsOptions = {
  flags: [{
    name: "flag",
    aliases: ["f"],
    standalone: true,
  }, {
    name: "all",
    aliases: ["a"],
  }, {
    name: "foo-bar",
    aliases: ["f"],
    type: OptionType.NUMBER,
    default: 3,
  }],
};

Deno.test("flags optionStandalone flag", () => {
  const { flags, unknown, literal } = parseFlags(["-f"], options);

  assertEquals(flags, { flag: true, fooBar: 3 });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags optionStandalone flagCombine", () => {
  assertThrows(
    () => parseFlags(["-f", "-a"], options),
    Error,
    `Option "--flag" cannot be combined with other options.`,
  );
});

Deno.test("flags optionStandalone flagCombineLong", () => {
  assertThrows(
    () => parseFlags(["--flag", "--all"], options),
    Error,
    `Option "--flag" cannot be combined with other options.`,
  );
});
