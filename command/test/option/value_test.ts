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
    .option("-i, --incremental", "...", {
      collect: true,
      value: (val: boolean, previous = 0) => val ? previous + 1 : 0,
    })
    .option("-d, --default", "...", {
      default: "foo",
      value: (value) => value === "foo" ? "bar" : "baz",
    });
}

Deno.test("command - option - value - function validator with no value", async () => {
  const { options } = await cmd().parse(["-f", "-d"]);

  assertEquals(options, { function: true, default: "bar" });
});

Deno.test("command - option - value - function validator with valid value", async () => {
  const { options } = await cmd().parse(["-f", "foo", "-d"]);

  assertEquals(options, { function: ["foo"], default: "bar" });
});

Deno.test("command - option - value - function validator with collected values", async () => {
  const { options } = await cmd().parse([
    "-f",
    "foo",
    "-f",
    "bar",
    "-f",
    "baz",
    "-d",
  ]);

  assertEquals(options, { function: ["foo", "bar", "baz"], default: "bar" });
});

Deno.test("command - option - value - function validator with invalid value", async () => {
  await assertThrowsAsync(
    () => cmd().parse(["-f", "fo", "-d"]),
    Error,
    `Option "--function" must be of type "string", but got "fo".`,
  );
});

Deno.test("command - option - value - function validator with no value", async () => {
  const { options } = await cmd().parse(["-iii"]);

  assertEquals(options, { incremental: 3, default: "bar" });
});

Deno.test("command - option - value - array validator with no value", async () => {
  const { options } = await cmd().parse(["-a", "-d"]);

  assertEquals(options, { array: true, default: "bar" });
});

Deno.test("command - option - value - array validator with valid value", async () => {
  const { options } = await cmd().parse(["-a", "foo", "-d"]);

  assertEquals(options, { array: ["foo"], default: "bar" });
});

Deno.test("command - option - value - array validator with collected values", async () => {
  const { options } = await cmd().parse([
    "-a",
    "foo",
    "-a",
    "bar",
    "-a",
    "baz",
    "-d",
  ]);

  assertEquals(options, { array: ["foo", "bar", "baz"], default: "bar" });
});

Deno.test("command - option - value - array validator with invalid value", async () => {
  await assertThrowsAsync(
    () => cmd().parse(["-a", "fo", "-d"]),
    Error,
    `Option "--array" must be of type "foo, bar, baz", but got "fo".`,
  );
});

Deno.test("command - option - value - regex validator with no value", async () => {
  const { options } = await cmd().parse(["-r", "-d"]);

  assertEquals(options, { regex: true, default: "bar" });
});

Deno.test("command - option - value - regex validator with valid value", async () => {
  const { options } = await cmd().parse(["-r", "foo", "-d"]);

  assertEquals(options, { regex: ["foo"], default: "bar" });
});

Deno.test("command - option - value - regex validator with collected values", async () => {
  const { options } = await cmd().parse([
    "-r",
    "foo",
    "-r",
    "bar",
    "-r",
    "baz",
    "-d",
  ]);

  assertEquals(options, { regex: ["foo", "bar", "baz"], default: "bar" });
});

Deno.test("command - option - value - regex validator with invalid value", async () => {
  await assertThrowsAsync(
    () => cmd().parse(["-r", "fo", "-d"]),
    Error,
    `Option "--regex" must be of type "/^(foo|bar|baz)$/", but got "fo".`,
  );
});
