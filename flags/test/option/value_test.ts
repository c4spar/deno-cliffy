import { assertEquals } from "../../../dev_deps.ts";
import { parseFlags } from "../../flags.ts";
import { IParseOptions } from "../../types.ts";

const options = <IParseOptions> {
  flags: [{
    name: "flag",
    aliases: ["f"],
    optionalValue: true,
    value(value: string): string[] {
      return [value];
    },
  }, {
    name: "flag2",
    aliases: ["F"],
    optionalValue: true,
  }],
};

Deno.test("flags: value handler", () => {
  const { flags, unknown, literal } = parseFlags(["-f", "-F"], options);

  assertEquals(flags, { flag: [true], flag2: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags: value handler with optional arg", () => {
  const { flags, unknown, literal } = parseFlags(
    ["-f", "1", "-F", "1"],
    options,
  );

  assertEquals(flags, { flag: [true], flag2: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});
