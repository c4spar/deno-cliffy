import { test } from "@cliffy/internal/testing/test";
import { assert, assertRejects } from "@std/assert";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .option("-f, --flag [value:boolean]", "description ...")
  .option("--no-flag", "description ...")
  .action(() => {});

test("should not throw an error if single flag is used", async () => {
  const parsedArgs = await cmd.parse(["-f", "true"]);
  assert(parsedArgs.options.flag === true);
});

test("command optionDuplicate flag", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "-f", "true"]);
    },
    Error,
    `Option "-f" can only occur once, but was found several times.`,
  );
});

test("command optionDuplicate flagLong", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "--flag"]);
    },
    Error,
    `Option "--flag" can only occur once, but was found several times.`,
  );
});

test("command optionDuplicate flagTrueLongFalse", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "true", "--flag", "false"]);
    },
    Error,
    `Option "--flag" can only occur once, but was found several times.`,
  );
});

test("command optionDuplicate flagTrueNoFlag", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "true", "--no-flag"]);
    },
    Error,
    `Option "--flag" can only occur once, but was found several times.`,
  );
});

test("command optionDuplicate flagTrueNoFlagTrue", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "true", "--no-flag", "true"]);
    },
    Error,
    `Option "--flag" can only occur once, but was found several times.`,
  );
});
