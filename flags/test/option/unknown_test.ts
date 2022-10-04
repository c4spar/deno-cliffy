import { assertEquals } from "../../../dev_deps.ts";
import { parseFlags } from "../../flags.ts";
import type { ParseFlagsOptions } from "../../types.ts";

const options: ParseFlagsOptions = {
  flags: [{
    name: "flag",
    aliases: ["f"],
  }],
};

Deno.test("unknown flags", () => {
  const { flags, unknown, literal } = parseFlags(
    ["-f", "foo", "-", "--", "bar"],
    options,
  );

  assertEquals(flags, { flag: true });
  assertEquals(unknown, ["foo", "-"]);
  assertEquals(literal, ["bar"]);
});
