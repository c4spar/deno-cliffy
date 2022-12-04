import { assertEquals, assertRejects, bold, red } from "../../dev_deps.ts";
import { List } from "../list.ts";

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
  await assertRejects(
    async () => {
      // deno-lint-ignore no-explicit-any
      List.inject(null as any);
      await List.prompt({
        message: "message",
        minTags: 3,
      });
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});

Deno.test("prompt list: min length", async () => {
  console.log();
  await assertRejects(
    async () => {
      List.inject("12");
      await List.prompt({
        message: "message",
        minLength: 3,
      });
    },
    Error,
    red(
      `${
        Deno.build.os === "windows" ? bold("× ") : bold("✘ ")
      }Value must be longer than 3 but has a length of 2.`,
    ),
  );
});

Deno.test("prompt list: max length", async () => {
  console.log();
  await assertRejects(
    async () => {
      List.inject("123");
      await List.prompt({
        message: "message",
        maxLength: 2,
      });
    },
    Error,
    red(
      `${
        Deno.build.os === "windows" ? bold("× ") : bold("✘ ")
      }Value can't be longer than 2 but has a length of 3.`,
    ),
  );
});

Deno.test("prompt list: min tags", async () => {
  console.log();
  await assertRejects(
    async () => {
      List.inject("");
      await List.prompt({
        message: "message",
        minTags: 3,
      });
    },
    Error,
    red(
      `${
        Deno.build.os === "windows" ? bold("× ") : bold("✘ ")
      }The minimum number of tags is 3 but got 0.`,
    ),
  );
});

Deno.test("prompt list: max tags", async () => {
  console.log();
  await assertRejects(
    async () => {
      List.inject("123, 456, 789");
      await List.prompt({
        message: "message",
        maxTags: 2,
      });
    },
    Error,
    red(
      `${
        Deno.build.os === "windows" ? bold("× ") : bold("✘ ")
      }The maximum number of tags is 2 but got 3.`,
    ),
  );
});

// @TODO: add maxLength option to list pormpt
Deno.test("prompt list: null value", async () => {
  console.log();
  await assertRejects(
    async () => {
      // deno-lint-ignore no-explicit-any
      List.inject(null as any);
      await List.prompt("message");
    },
    Error,
    red(
      `${Deno.build.os === "windows" ? bold("× ") : bold("✘ ")}Invalid answer.`,
    ),
  );
});
