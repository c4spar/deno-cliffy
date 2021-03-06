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
          value: string | boolean,
          previous: Array<string> = [],
        ): Array<string> | boolean {
          if (typeof value === "boolean") {
            return value;
          } else if (["foo", "bar", "baz"].includes(value)) {
            return [...previous, value];
          }
          throw new Error("invalid value");
        },
      },
    )
    .option("-i, --incremental", "...", {
      collect: true,
      value: (val: boolean, previous = 0) => val ? previous + 1 : 0,
    })
    .option("-b, --boolean", "...", {
      collect: true,
    })
    .option("-d, --default", "...", {
      default: "foo",
      value: (value) => value === "foo" ? "bar" : "baz",
    });
}

Deno.test("command - option - value - collect boolean", async () => {
  const { options } = await cmd().parse(["-bbb"]);

  assertEquals(options, { boolean: [true, true, true], default: "bar" });
});

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
    `invalid value`,
  );
});

Deno.test("command - option - value - function validator with incremental value", async () => {
  const { options } = await cmd().parse(["-iii"]);

  assertEquals(options, { incremental: 3, default: "bar" });
});
