import { assertEquals, assertRejects, bold, red } from "../../dev_deps.ts";
import { Confirm } from "../confirm.ts";

Deno.test("prompt confirm: y", async () => {
  console.log();
  Confirm.inject("y");
  const result: boolean | undefined = await Confirm.prompt("message");
  assertEquals(result, true);
});

Deno.test("prompt confirm: yes", async () => {
  console.log();
  Confirm.inject("Yes");
  const result: boolean | undefined = await Confirm.prompt("message");
  assertEquals(result, true);
});

Deno.test("prompt confirm: n", async () => {
  console.log();
  Confirm.inject("n");
  const result: boolean | undefined = await Confirm.prompt("message");
  assertEquals(result, false);
});

Deno.test("prompt confirm: no", async () => {
  console.log();
  Confirm.inject("No");
  const result: boolean | undefined = await Confirm.prompt("message");
  assertEquals(result, false);
});

Deno.test("prompt confirm: empty value", async () => {
  console.log();
  await assertRejects(
    async () => {
      Confirm.inject("");
      await Confirm.prompt("message");
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});

Deno.test("prompt confirm: invalid value", async () => {
  console.log();
  await assertRejects(
    async () => {
      Confirm.inject("noo");
      await Confirm.prompt("message");
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});

Deno.test("prompt confirm: null value", async () => {
  console.log();
  await assertRejects(
    async () => {
      // deno-lint-ignore no-explicit-any
      Confirm.inject(null as any);
      await Confirm.prompt("message");
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});
