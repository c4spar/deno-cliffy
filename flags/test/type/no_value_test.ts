import { assertEquals } from "../../../dev_deps.ts";
import { parseFlags } from "../../flags.ts";
import type { IParseOptions } from "../../types.ts";

const options = <IParseOptions> {
  flags: [{
    name: "flag",
    aliases: ["f"],
  }],
};

Deno.test("flags - type - no value - short flag without argument", () => {
  const { flags, unknown, literal } = parseFlags(["-f"], options);

  assertEquals(flags, { flag: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - type - no value - long flag without argument", () => {
  const { flags, unknown, literal } = parseFlags(["--flag"], options);

  assertEquals(flags, { flag: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - type - no value - short flag with argument", () => {
  const { flags, unknown, literal } = parseFlags(["-f", "true"], options);

  assertEquals(flags, { flag: true });
  assertEquals(unknown, ["true"]);
  assertEquals(literal, []);
});

Deno.test("flags - type - no value - long flag with argument", () => {
  const { flags, unknown, literal } = parseFlags(["--flag", "true"], options);

  assertEquals(flags, { flag: true });
  assertEquals(unknown, ["true"]);
  assertEquals(literal, []);
});
