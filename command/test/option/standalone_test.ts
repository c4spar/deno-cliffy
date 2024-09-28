import { test } from "@cliffy/internal/testing/test";
import { assertEquals, assertRejects } from "@std/assert";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .option("-f, --flag [value:boolean]", "description ...", { standalone: true })
  .option("-a, --all [value:boolean]", "description ...")
  .action(() => {});

test("command optionStandalone flag", async () => {
  const { options, args } = await cmd.parse(["-f"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

test("command optionStandalone flagCombine", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "-a"]);
    },
    Error,
    `Option "--flag" cannot be combined with other options.`,
  );
});

test("command optionStandalone flagCombineLong", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["--flag", "--all"]);
    },
    Error,
    `Option "--flag" cannot be combined with other options.`,
  );
});
