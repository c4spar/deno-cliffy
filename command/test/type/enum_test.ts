import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import { EnumType } from "../../types/enum.ts";

enum Color {
  Blue = "blue",
  Yellow = "yellow",
  Red = "red",
}

const cmd = () =>
  new Command()
    .throwErrors()
    .type("array-color", new EnumType(["blue", "yellow", "red"]))
    .option("--array-color [value:array-color]", "description ...")
    .type("enum-color", new EnumType(Color))
    .option("--enum-color [value:enum-color]", "description ...")
    .reset();

Deno.test("command - type - enum - with no value", async () => {
  const { options, args } = await cmd().parse(["--array-color"]);

  assertEquals(options, { arrayColor: true });
  assertEquals(args, []);
});

Deno.test("command - type - enum - with array", async () => {
  const { options, args } = await cmd().parse(["--array-color", "red"]);

  assertEquals(options, { arrayColor: "red" });
  assertEquals(args, []);
});

Deno.test("command - type - enum - with enum", async () => {
  const { options, args } = await cmd().parse(["--enum-color", "red"]);

  assertEquals(options, { enumColor: Color.Red });
  assertEquals(args, []);
});

Deno.test("command - type - enum - with array value", async () => {
  await assertRejects(
    async () => {
      await cmd().parse(["--array-color", "green"]);
    },
    Error,
    `Option "--array-color" must be of type "array-color", but got "green". Expected values: "blue", "yellow", "red"`,
  );
});

Deno.test("command - type - enum - with enum value", async () => {
  await assertRejects(
    async () => {
      await cmd().parse(["--enum-color", "green"]);
    },
    Error,
    `Option "--enum-color" must be of type "enum-color", but got "green". Expected values: "blue", "yellow", "red"`,
  );
});
