import { assertEquals, assertThrows } from "../../../dev_deps.ts";
import { parseFlags } from "../../flags.ts";
import { IParseOptions } from "../../types.ts";
import { OptionType } from "../../types.ts";

const options = <IParseOptions> {
  stopEarly: false,
  allowEmpty: false,
  flags: [{
    name: "flag",
    aliases: ["f"],
    type: OptionType.BOOLEAN,
    standalone: true,
  }, {
    name: "all",
    aliases: ["a"],
    type: OptionType.BOOLEAN,
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
    "Option --flag cannot be combined with other options.",
  );
});

Deno.test("flags optionStandalone flagCombineLong", () => {
  assertThrows(
    () => parseFlags(["--flag", "--all"], options),
    Error,
    "Option --flag cannot be combined with other options.",
  );
});
