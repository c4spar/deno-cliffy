import { assertEquals, assertThrows } from "../../../dev_deps.ts";
import { OptionType } from "../../deprecated.ts";
import { parseFlags } from "../../flags.ts";
import type { ParseFlagsOptions } from "../../types.ts";

const options: ParseFlagsOptions = {
  flags: [{
    name: "required",
    type: OptionType.STRING,
    required: true,
  }, {
    name: "required-value",
    type: OptionType.STRING,
  }, {
    name: "required-default",
    type: OptionType.STRING,
    default: "default",
  }],
};

Deno.test("flags - option - required - required option", () => {
  const { flags, unknown, literal } = parseFlags(
    ["--required", "foo"],
    options,
  );

  assertEquals(flags, { required: "foo", requiredDefault: "default" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - required - missing required option", () => {
  assertThrows(
    () => parseFlags([], options),
    Error,
    `Missing required option "--required".`,
  );
});

Deno.test("flags - option - required - required option value", () => {
  const { flags, unknown, literal } = parseFlags(
    ["--required", "foo", "--required-value", "bar"],
    options,
  );

  assertEquals(flags, {
    required: "foo",
    requiredDefault: "default",
    requiredValue: "bar",
  });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - required - missing required option value", () => {
  assertThrows(
    () => parseFlags(["--required", "foo", "--required-value"], options),
    Error,
    `Missing value for option "--required-value".`,
  );
});

Deno.test("flags - option - required - required option value with default value", () => {
  const { flags, unknown, literal } = parseFlags(
    ["--required", "foo", "--required-default", "baz"],
    options,
  );

  assertEquals(flags, { required: "foo", requiredDefault: "baz" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - option - required - missing required option value with default value", () => {
  assertThrows(
    () => parseFlags(["--required", "foo", "--required-default"], options),
    Error,
    `Missing value for option "--required-default".`,
  );
});
