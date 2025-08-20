import { test } from "@cliffy/internal/testing/test";
import { assertEquals } from "@std/assert";
import { parseFlags } from "../../flags.ts";

test("[flags] should skip optional arguments with an empty value", () => {
  const { flags, unknown, literal } = parseFlags(
    [
      "--foo",
      "",
      "--bar",
      "",
      "--baz",
      "",
      "--boop",
      "1",
      "--beep",
      "",
      "--beep",
      "beep-value-2",
      "--beep",
      "",
      "--beep",
      "beep-value-4",
    ],
    {
      flags: [{
        name: "foo",
        type: "number",
        optionalValue: true,
      }, {
        name: "bar",
        type: "boolean",
      }, {
        name: "baz",
        type: "string",
      }, {
        name: "beep",
        type: "string",
        collect: true,
      }, {
        name: "boop",
        type: "number",
      }],
    },
  );

  assertEquals(flags, {
    beep: [
      "beep-value-2",
      "beep-value-4",
    ],
    boop: 1,
  });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});
