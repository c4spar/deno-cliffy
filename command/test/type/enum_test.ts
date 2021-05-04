import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import { EnumType } from "../../types/enum.ts";

const cmd = () =>
  new Command()
    .throwErrors()
    .type("color", new EnumType(["blue", "yellow", "red"]))
    .option("-c, --color [value:color]", "description ...");

Deno.test("command - type - enum - with no value", async () => {
  const { options, args } = await cmd().parse(["-c"]);

  assertEquals(options, { color: true });
  assertEquals(args, []);
});

Deno.test("command - type - enum - with valid value", async () => {
  const { options, args } = await cmd().parse(["--color", "red"]);

  assertEquals(options, { color: "red" });
  assertEquals(args, []);
});

Deno.test("command - type - enum - with invalid value", async () => {
  await assertThrowsAsync(
    async () => {
      await cmd().parse(["-c", "green"]);
    },
    Error,
    `Option "--color" must be of type "color", but got "green". Expected values: blue, yellow, red`,
  );
});
