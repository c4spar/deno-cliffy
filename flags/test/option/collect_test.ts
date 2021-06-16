import { assertEquals, assertThrows } from "../../../dev_deps.ts";
import { parseFlags } from "../../flags.ts";
import type { IParseOptions } from "../../types.ts";
import { OptionType } from "../../types.ts";

const options = <IParseOptions> {
  allowEmpty: false,
  flags: [{
    name: "flag",
    aliases: ["f"],
    type: OptionType.STRING,
    optionalValue: true,
  }, {
    name: "no-flag",
  }, {
    name: "string",
    aliases: ["s"],
    type: OptionType.STRING,
    collect: true,
  }, {
    name: "boolean",
    aliases: ["b"],
    type: OptionType.BOOLEAN,
    optionalValue: true,
    collect: true,
  }, {
    name: "number",
    aliases: ["n"],
    type: OptionType.NUMBER,
    collect: true,
  }],
};

Deno.test("flags optionCollect flag", () => {
  assertThrows(
    () => parseFlags(["-f", "-f"], options),
    Error,
    `Option "-f" can only occur once, but was found several times.`,
  );
});

Deno.test("flags optionCollect flagLong", () => {
  assertThrows(
    () => parseFlags(["-f", "--flag"], options),
    Error,
    `Option "--flag" can only occur once, but was found several times.`,
  );
});

Deno.test("flags optionCollect flagTrueLongFalse", () => {
  assertThrows(
    () => parseFlags(["-f", "true", "--flag", "false"], options),
    Error,
    `Option "--flag" can only occur once, but was found several times.`,
  );
});

Deno.test("flags optionCollect flagTrueNoFlag", () => {
  assertThrows(
    () => parseFlags(["-f", "true", "--no-flag"], options),
    Error,
    `Option "--flag" can only occur once, but was found several times.`,
  );
});

Deno.test("flags optionCollect boolean", () => {
  const { flags, unknown, literal } = parseFlags(
    ["-b", "1", "--boolean", "0"],
    options,
  );

  assertEquals(flags, { boolean: [true, false] });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags optionCollect string", () => {
  const { flags, unknown, literal } = parseFlags(
    ["-s", "1", "--string", "0"],
    options,
  );

  assertEquals(flags, { string: ["1", "0"] });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags optionCollect number", () => {
  const { flags, unknown, literal } = parseFlags(
    ["-n", "1", "--number", "0"],
    options,
  );

  assertEquals(flags, { number: [1, 0] });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});
