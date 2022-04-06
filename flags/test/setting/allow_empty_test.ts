import { assertEquals, assertThrows } from "../../../dev_deps.ts";
import { parseFlags } from "../../flags.ts";

Deno.test("[flags] should not allow empty by default", () => {
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

Deno.test("[flags] should not allow empty if disabled", () => {
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

Deno.test("[flags] should allow empty if enabled", () => {
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
