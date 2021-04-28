import { assertEquals, assertThrows } from "../../../dev_deps.ts";
import { parseFlags } from "../../flags.ts";
import type { IParseOptions } from "../../types.ts";
import { OptionType } from "../../types.ts";

const options = <IParseOptions> {
  flags: [{
    name: "function",
    aliases: ["f"],
    type: OptionType.STRING,
    optionalValue: true,
    collect: true,
    value(
      value: string,
      previous: Array<string> = [],
    ): Array<string> | undefined {
      if (["foo", "bar", "baz"].includes(value)) {
        return [...previous, value];
      }
    },
  }, {
    name: "array",
    aliases: ["a"],
    type: OptionType.STRING,
    optionalValue: true,
    collect: true,
    value: ["foo", "bar", "baz"],
  }, {
    name: "regex",
    aliases: ["r"],
    type: OptionType.STRING,
    optionalValue: true,
    collect: true,
    value: /^(foo|bar|baz)$/,
  }, {
    name: "optional",
    aliases: ["o"],
  }],
};

Deno.test("flags - option - value - function validator with no value", () => {
  const { flags, unknown, literal } = parseFlags(["-f", "-o"], options);

  assertEquals(flags, { function: true, optional: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - function validator with valid value", () => {
  const { flags, unknown, literal } = parseFlags(["-f", "foo", "-o"], options);

  assertEquals(flags, { function: ["foo"], optional: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - function validator with collected values", () => {
  const { flags, unknown, literal } = parseFlags([
    "-f",
    "foo",
    "-f",
    "bar",
    "-f",
    "baz",
    "-o",
  ], options);

  assertEquals(flags, { function: ["foo", "bar", "baz"], optional: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - function validator with invalid value", () => {
  assertThrows(
    () => parseFlags(["-f", "fo", "-o"], options),
    Error,
    `Option "--function" must be of type "string", but got "fo".`,
  );
});

Deno.test("flags - option - value - array validator with no value", () => {
  const { flags, unknown, literal } = parseFlags(["-a", "-o"], options);

  assertEquals(flags, { array: true, optional: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - array validator with valid value", () => {
  const { flags, unknown, literal } = parseFlags(["-a", "foo", "-o"], options);

  assertEquals(flags, { array: ["foo"], optional: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - array validator with collected values", () => {
  const { flags, unknown, literal } = parseFlags([
    "-a",
    "foo",
    "-a",
    "bar",
    "-a",
    "baz",
    "-o",
  ], options);

  assertEquals(flags, { array: ["foo", "bar", "baz"], optional: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - array validator with invalid value", () => {
  assertThrows(
    () => parseFlags(["-a", "fo", "-o"], options),
    Error,
    `Option "--array" must be of type "foo, bar, baz", but got "fo".`,
  );
});

Deno.test("flags - option - value - regex validator with no value", () => {
  const { flags, unknown, literal } = parseFlags(["-r", "-o"], options);

  assertEquals(flags, { regex: true, optional: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - regex validator with valid value", () => {
  const { flags, unknown, literal } = parseFlags(["-r", "foo", "-o"], options);

  assertEquals(flags, { regex: ["foo"], optional: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - regex validator with collected values", () => {
  const { flags, unknown, literal } = parseFlags([
    "-r",
    "foo",
    "-r",
    "bar",
    "-r",
    "baz",
    "-o",
  ], options);

  assertEquals(flags, { regex: ["foo", "bar", "baz"], optional: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - regex validator with invalid value", () => {
  assertThrows(
    () => parseFlags(["-r", "fo", "-o"], options),
    Error,
    `Option "--regex" must be of type "/^(foo|bar|baz)$/", but got "fo".`,
  );
});
