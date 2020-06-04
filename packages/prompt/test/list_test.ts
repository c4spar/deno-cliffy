import { bold, red } from "https://deno.land/std@v0.52.0/fmt/colors.ts";
import { List } from "../prompts/list.ts";
import { assertEquals, assertThrowsAsync } from "./lib/assert.ts";

Deno.test('prompt list: , separator option: ","', async () => {
  console.log();
  List.inject("tag1, tag2, tag3");
  const result: string[] | undefined = await List.prompt("message");
  assertEquals(result, ["tag1", "tag2", "tag3"]);
});

Deno.test('prompt list: separator option: " "', async () => {
  console.log();
  List.inject("tag1 tag2 tag3");
  const result: string[] | undefined = await List.prompt({
    message: "message",
    separator: " ",
  });
  assertEquals(result, ["tag1", "tag2", "tag3"]);
});

Deno.test('prompt list: separator option: ";"', async () => {
  console.log();
  List.inject(" tag tag1 ; tag2 ; tag3 ");
  const result: string[] | undefined = await List.prompt({
    message: "message",
    separator: ";",
  });
  assertEquals(result, ["tag tag1", "tag2", "tag3"]);
});

Deno.test('prompt list: separator option: "-"', async () => {
  console.log();
  List.inject(" tag tag1 -tag2-tag3 ");
  const result: string[] | undefined = await List.prompt({
    message: "message",
    separator: "-",
  });
  assertEquals(result, ["tag tag1", "tag2", "tag3"]);
});

Deno.test("prompt list: empty value", async () => {
  console.log();
  await assertThrowsAsync(
    async () => {
      List.inject("");
      await List.prompt("message");
    },
    Error,
    red(
      `${
        Deno.build.os === "windows" ? bold(" × ") : bold(" ✘ ")
      }Invalid answer.`,
    ),
  );
});

// @TODO: add maxLength option to list pormpt
Deno.test("prompt list: null value", async () => {
  console.log();
  await assertThrowsAsync(
    async () => {
      List.inject(null as any);
      await List.prompt("message");
    },
    Error,
    red(
      `${
        Deno.build.os === "windows" ? bold(" × ") : bold(" ✘ ")
      }Invalid answer.`,
    ),
  );
});
