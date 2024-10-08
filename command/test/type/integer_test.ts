import { test } from "@cliffy/internal/testing/test";
import { assertEquals, assertRejects } from "@std/assert";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .option("-f, --flag [value:integer]", "description ...")
  .option("-F, --flag2 <value:integer>", "description ...")
  .action(() => {});

test("command - type - integer - with no value", async () => {
  const { options, args } = await cmd.parse(["-f"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

test("command - type - integer - with valid value", async () => {
  const { options, args } = await cmd.parse(["--flag", "123"]);

  assertEquals(options, { flag: 123 });
  assertEquals(args, []);
});

test("command - type - integer - with argument", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "123", "unknown"]);
    },
    Error,
    `No arguments allowed for command "COMMAND".`,
  );
});

test("command - type - integer - with missing value", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-F"]);
    },
    Error,
    `Missing value for option "--flag2".`,
  );
});

test("command - type - integer - with invalid string value", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "abc"]);
    },
    Error,
    `Option "--flag" must be of type "integer", but got "abc".`,
  );
});

test("command - type - integer - with invalid float value", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "1.23"]);
    },
    Error,
    `Option "--flag" must be of type "integer", but got "1.23".`,
  );
});
