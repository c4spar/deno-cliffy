import { assertEquals, assertRejects, bold, red } from "../../dev_deps.ts";
import { Number } from "../number.ts";

Deno.test("prompt number: value", async () => {
  console.log();
  Number.inject("1");
  const result: number | undefined = await Number.prompt("message");
  assertEquals(result, 1);
});

Deno.test("prompt number: negative value", async () => {
  console.log();
  Number.inject("-1");
  const result: number | undefined = await Number.prompt("message");
  assertEquals(result, -1);
});

Deno.test("prompt number: number value", async () => {
  console.log();
  Number.inject("0");
  const result: number | undefined = await Number.prompt("message");
  assertEquals(result, 0);
});

Deno.test("prompt number: empty value", async () => {
  await assertRejects(
    async () => {
      Number.inject("");
      await Number.prompt("message");
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});

Deno.test("prompt number: invalid value", async () => {
  await assertRejects(
    async () => {
      Number.inject("abc");
      await Number.prompt("message");
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});

Deno.test("prompt number: null value", async () => {
  await assertRejects(
    async () => {
      // deno-lint-ignore no-explicit-any
      Number.inject(null as any);
      await Number.prompt("message");
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});
