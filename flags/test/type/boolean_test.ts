import { assertEquals, assertThrows } from "../../../dev_deps.ts";
import { parseFlags } from "../../flags.ts";
import { OptionType } from "../../types.ts";

const options = {
  stopEarly: false,
  allowEmpty: false,
  flags: [{
    name: "flag",
    aliases: ["f"],
    type: OptionType.BOOLEAN,
    optionalValue: true,
    standalone: true,
  }, {
    name: "no-flag",
  }],
};

Deno.test("flags typeBoolean flag", () => {
  const { flags, unknown, literal } = parseFlags(["-f"], options);

  assertEquals(flags, { flag: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags typeBoolean flagLong", () => {
  const { flags, unknown, literal } = parseFlags(["--flag"], options);

  assertEquals(flags, { flag: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags typeBoolean flagTrue", () => {
  const { flags, unknown, literal } = parseFlags(["-f", "true"], options);

  assertEquals(flags, { flag: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags typeBoolean flagLongTrue", () => {
  const { flags, unknown, literal } = parseFlags(["--flag", "true"], options);

  assertEquals(flags, { flag: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags typeBoolean flagFalse", () => {
  const { flags, unknown, literal } = parseFlags(["-f", "false"], options);

  assertEquals(flags, { flag: false });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags typeBoolean flagLongFalseUnknown", () => {
  const { flags, unknown, literal } = parseFlags(
    ["--flag", "false", "unknown"],
    options,
  );

  assertEquals(flags, { flag: false });
  assertEquals(unknown, ["unknown"]);
  assertEquals(literal, []);
});

Deno.test("flags typeBoolean flagTrue", () => {
  const { flags, unknown, literal } = parseFlags(["-f", "1"], options);

  assertEquals(flags, { flag: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags typeBoolean flagLongTrue", () => {
  const { flags, unknown, literal } = parseFlags(["--flag", "1"], options);

  assertEquals(flags, { flag: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags typeBoolean flagFalse", () => {
  const { flags, unknown, literal } = parseFlags(["-f", "0"], options);

  assertEquals(flags, { flag: false });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags typeBoolean flagLongFalseUnknown", () => {
  const { flags, unknown, literal } = parseFlags(
    ["--flag", "0", "unknown"],
    options,
  );

  assertEquals(flags, { flag: false });
  assertEquals(unknown, ["unknown"]);
  assertEquals(literal, []);
});

Deno.test("flags typeBoolean noFlagUnknown", () => {
  const { flags, unknown, literal } = parseFlags(
    ["--no-flag", "unknown"],
    options,
  );

  assertEquals(flags, { flag: false });
  assertEquals(unknown, ["unknown"]);
  assertEquals(literal, []);
});

Deno.test("flags typeBoolean flagInvalidType", () => {
  assertThrows(
    () => parseFlags(["-f", "unknown"], options),
    Error,
    `Option "--flag" must be of type "boolean", but got "unknown".`,
  );
});
