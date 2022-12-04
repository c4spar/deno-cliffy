import { assertEquals, assertRejects, bold, red } from "../../dev_deps.ts";
import { Input } from "../input.ts";

Deno.test("prompt input: value", async () => {
  console.log();
  Input.inject("hallo");
  const result: string | undefined = await Input.prompt("message");
  assertEquals(result, "hallo");
});

Deno.test("prompt input: validate option", async () => {
  console.log();
  Input.inject("foo");
  const result: string | undefined = await Input.prompt({
    message: "message",
    validate: (value) => value.length < 10,
  });
  assertEquals(result, "foo");
});

Deno.test("prompt input: default value", async () => {
  console.log();
  Input.inject("");
  const result: string | undefined = await Input.prompt({
    message: "message",
    default: "default",
    validate: (value) => value.length < 10,
  });
  assertEquals(result, "default");
});

Deno.test("prompt input: empty value", async () => {
  console.log();
  await assertRejects(
    async () => {
      Input.inject("");
      await Input.prompt({
        message: "message",
        minLength: 8,
      });
    },
    Error,
    red(
      `${
        Deno.build.os === "windows" ? bold("× ") : bold("✘ ")
      }Value must be longer than 8 but has a length of 0.`,
    ),
  );
});

Deno.test("prompt input: invalid value", async () => {
  console.log();
  await assertRejects(
    async () => {
      Input.inject("a".repeat(10));
      await Input.prompt({
        message: "message",
        validate: (value) => value.length < 10,
      });
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});

Deno.test("prompt input: null value", async () => {
  console.log();
  await assertRejects(
    async () => {
      // deno-lint-ignore no-explicit-any
      Input.inject(null as any);
      await Input.prompt("message");
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});
