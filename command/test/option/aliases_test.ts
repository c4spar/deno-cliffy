import { test } from "@cliffy/internal/testing/test";
import { assertEquals, assertRejects } from "@std/assert";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .option("-f, --flag, --fl, --flags [value:boolean]", "description ...")
  .action(() => {});

test("command optionAliases f", async () => {
  const { options, args } = await cmd.parse(["-f"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

test("command optionAliases fl", async () => {
  const { options, args } = await cmd.parse(["--fl"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

test("command optionAliases flag", async () => {
  const { options, args } = await cmd.parse(["--flag"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

test("command optionAliases flags", async () => {
  const { options, args } = await cmd.parse(["--flags"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

test("command optionAliases fInvalidValie", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "value"]);
    },
    Error,
    `Option "--flag" must be of type "boolean", but got "value".`,
  );
});

test("command optionAliases flInvalidValue", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["--fl", "value"]);
    },
    Error,
    `Option "--flag" must be of type "boolean", but got "value".`,
  );
});

test("command optionAliases flagInvalidValue", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["--flag", "value"]);
    },
    Error,
    `Option "--flag" must be of type "boolean", but got "value".`,
  );
});

test("command optionAliases flagsInvalidValue", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["--flags", "value"]);
    },
    Error,
    `Option "--flag" must be of type "boolean", but got "value".`,
  );
});
