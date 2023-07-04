import { assertEquals, assertRejects, bold, red } from "../../dev_deps.ts";
import { Checkbox } from "../checkbox.ts";

Deno.test("prompt checkbox: valid value", async () => {
  Checkbox.inject(["value1", "value3"]);
  const result: string[] | undefined = await Checkbox.prompt({
    message: "message",
    options: [{ value: "value1" }, { value: "value2" }, "value3"],
  });
  assertEquals(result, ["value1", "value3"]);
});

Deno.test("prompt checkbox: empty value", async () => {
  Checkbox.inject([]);
  const result: string[] | undefined = await Checkbox.prompt({
    message: "message",
    options: [{ value: "value1" }, { value: "value2" }, "value3"],
  });
  assertEquals(result, []);
});

Deno.test("prompt checkbox: invalid value", async () => {
  await assertRejects(
    async () => {
      Checkbox.inject(["value3", "value4"]);
      await Checkbox.prompt({
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

Deno.test("prompt checkbox: null value", async () => {
  await assertRejects(
    async () => {
      // deno-lint-ignore no-explicit-any
      Checkbox.inject(null as any);
      await Checkbox.prompt({
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

Deno.test("prompt checkbox: min options", async () => {
  await assertRejects(
    async () => {
      Checkbox.inject(["value1", "value2"]);
      await Checkbox.prompt({
        message: "message",
        minOptions: 3,
        options: [{ value: "value1" }, { value: "value2" }, "value3"],
      });
    },
    Error,
    red(
      `${
        Deno.build.os === "windows" ? bold("× ") : bold("✘ ")
      }The minimum number of options is 3 but got 2.`,
    ),
  );
});

Deno.test("prompt checkbox: max options", async () => {
  await assertRejects(
    async () => {
      Checkbox.inject(["value1", "value2"]);
      await Checkbox.prompt({
        message: "message",
        maxOptions: 1,
        options: [{ value: "value1" }, { value: "value2" }, "value3"],
      });
    },
    Error,
    red(
      `${
        Deno.build.os === "windows" ? bold("× ") : bold("✘ ")
      }The maximum number of options is 1 but got 2.`,
    ),
  );
});
