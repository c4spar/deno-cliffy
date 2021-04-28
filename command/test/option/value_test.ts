import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

function cmd() {
  return new Command()
    .throwErrors()
    .option(
      "-f, --function [value]",
      "...",
      {
        collect: true,
        value(
          value: string,
          previous: Array<string> = [],
        ): Array<string> | undefined {
          if (["foo", "bar", "baz"].includes(value)) {
            return [...previous, value];
          }
        },
      },
    )
    .option("-a, --array [value]", "...", {
      collect: true,
      value: ["foo", "bar", "baz"],
    })
    .option("-r, --regex [value]", "...", {
      collect: true,
      value: /^(foo|bar|baz)$/,
    })
    .option("-o, --optional", "...");
}

Deno.test("command - option - value - function validator with no value", async () => {
  const { options } = await cmd().parse(["-f", "-o"]);

  assertEquals(options, { function: true, optional: true });
});

Deno.test("command - option - value - function validator with valid value", async () => {
  const { options } = await cmd().parse(["-f", "foo", "-o"]);

  assertEquals(options, { function: ["foo"], optional: true });
});

Deno.test("command - option - value - function validator with collected values", async () => {
  const { options } = await cmd().parse([
    "-f",
    "foo",
    "-f",
    "bar",
    "-f",
    "baz",
    "-o",
  ]);

  assertEquals(options, { function: ["foo", "bar", "baz"], optional: true });
});

Deno.test("command - option - value - function validator with invalid value", async () => {
  await assertThrowsAsync(
    () => cmd().parse(["-f", "fo", "-o"]),
    Error,
    `Option "--function" must be of type "string", but got "fo".`,
  );
});

Deno.test("command - option - value - array validator with no value", async () => {
  const { options } = await cmd().parse(["-a", "-o"]);

  assertEquals(options, { array: true, optional: true });
});

Deno.test("command - option - value - array validator with valid value", async () => {
  const { options } = await cmd().parse(["-a", "foo", "-o"]);

  assertEquals(options, { array: ["foo"], optional: true });
});

Deno.test("command - option - value - array validator with collected values", async () => {
  const { options } = await cmd().parse([
    "-a",
    "foo",
    "-a",
    "bar",
    "-a",
    "baz",
    "-o",
  ]);

  assertEquals(options, { array: ["foo", "bar", "baz"], optional: true });
});

Deno.test("command - option - value - array validator with invalid value", async () => {
  await assertThrowsAsync(
    () => cmd().parse(["-a", "fo", "-o"]),
    Error,
    `Option "--array" must be of type "foo, bar, baz", but got "fo".`,
  );
});

Deno.test("command - option - value - regex validator with no value", async () => {
  const { options } = await cmd().parse(["-r", "-o"]);

  assertEquals(options, { regex: true, optional: true });
});

Deno.test("command - option - value - regex validator with valid value", async () => {
  const { options } = await cmd().parse(["-r", "foo", "-o"]);

  assertEquals(options, { regex: ["foo"], optional: true });
});

Deno.test("command - option - value - regex validator with collected values", async () => {
  const { options } = await cmd().parse([
    "-r",
    "foo",
    "-r",
    "bar",
    "-r",
    "baz",
    "-o",
  ]);

  assertEquals(options, { regex: ["foo", "bar", "baz"], optional: true });
});

Deno.test("command - option - value - regex validator with invalid value", async () => {
  await assertThrowsAsync(
    () => cmd().parse(["-r", "fo", "-o"]),
    Error,
    `Option "--regex" must be of type "/^(foo|bar|baz)$/", but got "fo".`,
  );
});
