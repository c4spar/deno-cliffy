import { test } from "@cliffy/internal/testing/test";
import { assertEquals, assertRejects } from "@std/assert";
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
    .type("array-color", new EnumType(["blue", "yellow", "red", 1, true]))
    .option("--array-color [value:array-color]", "description ...")
    .type("enum-color", new EnumType(Color))
    .option("--enum-color [value:enum-color]", "description ...")
    .reset();

test("command - type - enum - with no value", async () => {
  const { options, args } = await cmd().parse(["--array-color"]);

  assertEquals(options, { arrayColor: true });
  assertEquals(args, []);
});

test("command - type - enum - with array and string value", async () => {
  const { options, args } = await cmd().parse(["--array-color", "red"]);

  assertEquals(options, { arrayColor: "red" });
  assertEquals(args, []);
});

test("command - type - enum - with array and number value", async () => {
  const { options, args } = await cmd().parse(["--array-color", "1"]);

  assertEquals(options, { arrayColor: 1 });
  assertEquals(args, []);
});

test("command - type - enum - with array and boolean value", async () => {
  const { options, args } = await cmd().parse(["--array-color", "true"]);

  assertEquals(options, { arrayColor: true });
  assertEquals(args, []);
});

test("command - type - enum - with enum", async () => {
  const { options, args } = await cmd().parse(["--enum-color", "red"]);

  assertEquals(options, { enumColor: Color.Red });
  assertEquals(args, []);
});

test("command - type - enum - with array value", async () => {
  await assertRejects(
    async () => {
      await cmd().parse(["--array-color", "green"]);
    },
    Error,
    `Option "--array-color" must be of type "array-color", but got "green". Expected values: "blue", "yellow", "red"`,
  );
});

test("command - type - enum - with enum value", async () => {
  await assertRejects(
    async () => {
      await cmd().parse(["--enum-color", "green"]);
    },
    Error,
    `Option "--enum-color" must be of type "enum-color", but got "green". Expected values: "blue", "yellow", "red"`,
  );
});
