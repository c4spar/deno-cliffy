import { test } from "@cliffy/internal/testing/test";
import { assertEquals } from "@std/assert";
import { parseFlags } from "../../flags.ts";
import type { ParseFlagsOptions } from "../../types.ts";

const options: ParseFlagsOptions = {
  flags: [{
    name: "flag",
    aliases: ["f"],
  }],
};

test("unknown flags", () => {
  const { flags, unknown, literal } = parseFlags(
    ["-f", "foo", "-", "--", "bar"],
    options,
  );

  assertEquals(flags, { flag: true });
  assertEquals(unknown, ["foo", "-"]);
  assertEquals(literal, ["bar"]);
});
