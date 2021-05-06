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
    name: "incremental",
    aliases: ["i"],
    collect: true,
    value: (val: boolean, previous = 0) => val ? previous + 1 : 0,
  }, {
    name: "default",
    aliases: ["d"],
    default: "foo",
    value: (value) => value === "foo" ? "bar" : "baz",
  }],
};

Deno.test("flags - option - value - function validator with no value", () => {
  const { flags, unknown, literal } = parseFlags(["-f", "-d"], options);

  assertEquals(flags, { function: true, default: "bar" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - function validator with valid value", () => {
  const { flags, unknown, literal } = parseFlags(["-f", "foo", "-d"], options);

  assertEquals(flags, { function: ["foo"], default: "bar" });
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
    "-d",
  ], options);

  assertEquals(flags, { function: ["foo", "bar", "baz"], default: "bar" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - function validator with invalid value", () => {
  assertThrows(
    () => parseFlags(["-f", "fo", "-d"], options),
    Error,
    `Option "--function" must be of type "string", but got "fo".`,
  );
});

Deno.test("flags - option - value - function validator with incremental value", () => {
  const { flags } = parseFlags(["-iii"], options);
  assertEquals(flags, { incremental: 3, default: "bar" });
});

Deno.test("flags - option - value - array validator with no value", () => {
  const { flags, unknown, literal } = parseFlags(["-a", "-d"], options);

  assertEquals(flags, { array: true, default: "bar" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - array validator with valid value", () => {
  const { flags, unknown, literal } = parseFlags(["-a", "foo", "-d"], options);

  assertEquals(flags, { array: ["foo"], default: "bar" });
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
    "-d",
  ], options);

  assertEquals(flags, { array: ["foo", "bar", "baz"], default: "bar" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - array validator with invalid value", () => {
  assertThrows(
    () => parseFlags(["-a", "fo", "-d"], options),
    Error,
    `Option "--array" must be of type "foo, bar, baz", but got "fo".`,
  );
});

Deno.test("flags - option - value - regex validator with no value", () => {
  const { flags, unknown, literal } = parseFlags(["-r", "-d"], options);

  assertEquals(flags, { regex: true, default: "bar" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - regex validator with valid value", () => {
  const { flags, unknown, literal } = parseFlags(["-r", "foo", "-d"], options);

  assertEquals(flags, { regex: ["foo"], default: "bar" });
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
    "-d",
  ], options);

  assertEquals(flags, { regex: ["foo", "bar", "baz"], default: "bar" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - value - regex validator with invalid value", () => {
  assertThrows(
    () => parseFlags(["-r", "fo", "-d"], options),
    Error,
    `Option "--regex" must be of type "/^(foo|bar|baz)$/", but got "fo".`,
  );
});
