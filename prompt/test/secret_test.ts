import { assertEquals, assertRejects, bold, red } from "../../dev_deps.ts";
import { Secret } from "../secret.ts";

Deno.test("prompt secret: value", async () => {
  console.log();
  Secret.inject("hallo");
  const result: string | undefined = await Secret.prompt("message");
  assertEquals(result, "hallo");
});

Deno.test("prompt secret: validate option", async () => {
  console.log();
  Secret.inject("a".repeat(9));
  const result: string | undefined = await Secret.prompt({
    message: "message",
    validate: (value: string) => value.length < 10,
  });
  assertEquals(result, "a".repeat(9));
});

Deno.test("prompt secret: empty value", async () => {
  console.log();
  await assertRejects(
    async () => {
      Secret.inject("");
      await Secret.prompt({
        message: "message",
        minLength: 8,
      });
    },
    Error,
    red(
      `${
        Deno.build.os === "windows" ? bold("× ") : bold("✘ ")
      }Secret must be longer than 8 but has a length of 0.`,
    ),
  );
});

Deno.test("prompt secret: invalid value", async () => {
  console.log();
  await assertRejects(
    async () => {
      Secret.inject("a".repeat(10));
      await Secret.prompt({
        message: "message",
        validate: (value: string) => value.length < 10,
      });
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});

Deno.test("prompt secret: null value", async () => {
  console.log();
  await assertRejects(
    async () => {
      // deno-lint-ignore no-explicit-any
      Secret.inject(null as any);
      await Secret.prompt("message");
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});
