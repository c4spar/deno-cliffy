import { assertEquals, assertRejects } from "@std/assert";
import { bold, red } from "@std/fmt/colors";
import { assertType, type IsExact } from "@std/testing/types";
import { Select } from "../select.ts";

Deno.test("prompt select: value", async () => {
  console.log();
  Select.inject("value2");
  const result: string | undefined = await Select.prompt({
    message: "message",
    options: [{ value: "value1" }, { value: "value2" }, "value3"],
  });
  assertEquals(result, "value2");
});

Deno.test("prompt select: object value", async () => {
  Select.inject({ id: 1, name: "foo" });

  const books = [
    { id: 1, name: "foo" },
    { id: 2, name: "bar" },
  ];

  const result = await Select.prompt({
    message: "please select a book",
    options: books.map((x) => ({ name: x.name, value: x })),
  });

  assertEquals(result, { id: 1, name: "foo" });
  assertType<IsExact<typeof result, { id: number; name: string }>>(true);
});

Deno.test("prompt select: empty value", async () => {
  await assertRejects(
    async () => {
      Select.inject("");
      await Select.prompt({
        message: "message",
        options: [{ value: "value1" }, { value: "value2" }, "value3"],
      });
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});

Deno.test("prompt select: invalid value", async () => {
  await assertRejects(
    async () => {
      Select.inject("value4");
      await Select.prompt({
        message: "message",
        options: [{ value: "value1" }, { value: "value2" }, "value3"],
      });
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});

Deno.test("prompt select: null value", async () => {
  await assertRejects(
    async () => {
      // deno-lint-ignore no-explicit-any
      Select.inject(null as any);
      await Select.prompt({
        message: "message",
        options: [{ value: "value1" }, { value: "value2" }, "value3"],
      });
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});
