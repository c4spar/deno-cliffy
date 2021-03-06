import { assertEquals } from "../../../dev_deps.ts";
import { parseFlags } from "../../flags.ts";
import { IFlagOptions, OptionType } from "../../types.ts";

Deno.test("flags option callback", () => {
  const options: Array<{ option: IFlagOptions; value: unknown }> = [];
  parseFlags([
    "--foo",
    "fooVal",
    "--bar",
    "barVal",
    "--baz",
    "bazVal",
  ], {
    flags: [{
      name: "foo",
      type: OptionType.STRING,
    }, {
      name: "bar",
      type: OptionType.STRING,
    }, {
      name: "baz",
      type: OptionType.STRING,
    }],
    option: (option, value) => {
      options.push({ option, value });
    },
  });

  assertEquals(options.length, 3);
  assertEquals(options[0].option.name, "foo");
  assertEquals(options[0].value, "fooVal");
  assertEquals(options[1].option.name, "bar");
  assertEquals(options[1].value, "barVal");
  assertEquals(options[2].option.name, "baz");
  assertEquals(options[2].value, "bazVal");
});
