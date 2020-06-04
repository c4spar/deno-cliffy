import { parseFlags } from "../../lib/flags.ts";
import { IParseOptions, OptionType } from "../../lib/types.ts";
import { assertEquals } from "../lib/assert.ts";

const options = <IParseOptions> {
  allowEmpty: true,
  flags: [{
    name: "boolean",
    aliases: ["b"],
    type: OptionType.BOOLEAN,
    default: false,
  }, {
    name: "string",
    aliases: ["s"],
    type: OptionType.STRING,
    default: "0",
  }, {
    name: "number",
    aliases: ["n"],
    type: OptionType.NUMBER,
    default: 0,
  }, {
    name: "boolean2",
    aliases: ["B"],
    type: OptionType.BOOLEAN,
    default: true,
  }, {
    name: "string2",
    aliases: ["S"],
    type: OptionType.STRING,
    default: "1",
  }, {
    name: "number2",
    aliases: ["N"],
    type: OptionType.NUMBER,
    default: 1,
  }, {
    name: "method",
    aliases: ["m"],
    type: OptionType.NUMBER,
    default: () => 1,
  }],
};

Deno.test("flags default option: no arguments", () => {
  const { flags, unknown, literal } = parseFlags([], options);

  assertEquals(flags, {
    boolean: false,
    string: "0",
    number: 0,
    boolean2: true,
    string2: "1",
    number2: 1,
    method: 1,
  });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags default option: override default values", () => {
  const { flags, unknown, literal } = parseFlags(
    [
      "-b",
      "1",
      "-s",
      "1",
      "-n",
      "1",
      "-B",
      "0",
      "-S",
      "0",
      "-N",
      "0",
      "-m",
      "0",
    ],
    options,
  );

  assertEquals(flags, {
    boolean: true,
    string: "1",
    number: 1,
    boolean2: false,
    string2: "0",
    number2: 0,
    method: 0,
  });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags optionDefault override default value with optional value", () => {
  const { flags, unknown, literal } = parseFlags(["-b"], options);

  assertEquals(flags, {
    boolean: true,
    string: "0",
    number: 0,
    boolean2: true,
    string2: "1",
    number2: 1,
    method: 1,
  });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});
