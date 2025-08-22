import { test } from "@cliffy/internal/testing/test";
import {
  assertEquals,
  assertMatch,
  assertNotMatch,
  assertRejects,
} from "@std/assert";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .option("-f, --flag [value:secret]", "description ...")
  .option("-d, --default [value:secret]", "description ...", {
    default: "DEFAULT",
  })
  .option("--no-flag", "description ...")
  .action(() => {});

test("command - type - secret - with no value", async () => {
  const { options, args } = await cmd.parse(["-f"]);

  assertEquals(options, { flag: true, default: "DEFAULT" });
  assertEquals(args, []);
  assertNotMatch(cmd.getHelp(), /"DEFAULT"/g);
  assertMatch(cmd.getHelp(), /"\*\*\*\*\*\*"/g);
});

test("command - type - secret - with valid value", async () => {
  const { options, args } = await cmd.parse(["--flag", "value"]);

  assertEquals(options, { flag: "value", default: "DEFAULT" });
  assertEquals(args, []);
  assertNotMatch(cmd.getHelp(), /"DEFAULT"/g);
  assertMatch(cmd.getHelp(), /"\*\*\*\*\*\*"/g);
});

test("command - type - secret - no arguments allowed", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "value", "unknown"]);
    },
    Error,
    `No arguments allowed for command "COMMAND".`,
  );
});
