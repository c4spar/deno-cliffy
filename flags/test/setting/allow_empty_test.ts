import { test } from "@cliffy/internal/testing/test";
import { assertEquals, assertThrows } from "@std/assert";
import { parseFlags } from "../../flags.ts";

test("[flags] should not allow empty by default", () => {
  assertThrows(
    () =>
      parseFlags([], {
        flags: [{
          name: "flag",
          required: true,
        }],
      }),
    Error,
    'Missing required option "--flag".',
  );
});

test("[flags] should not allow empty if disabled", () => {
  assertThrows(
    () =>
      parseFlags([], {
        allowEmpty: false,
        flags: [{
          name: "flag",
          required: true,
        }],
      }),
    Error,
    'Missing required option "--flag".',
  );
});

test("[flags] should allow empty if enabled", () => {
  const { flags, unknown } = parseFlags([], {
    allowEmpty: true,
    flags: [{
      name: "flag",
      required: true,
    }],
  });

  assertEquals(flags, {});
  assertEquals(unknown, []);
});
