import { test } from "@cliffy/internal/testing/test";
import { assertEquals, assertRejects } from "@std/assert";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .allowEmpty(false)
  .option("-f, --flag [value:string]", "description ...", { required: true })
  .action(() => {});

test("command optionRequired", async () => {
  const { options, args } = await cmd.parse(["-f", "value"]);

  assertEquals(options, { flag: "value" });
  assertEquals(args, []);
});

test("command optionRequired noArguments", async () => {
  await assertRejects(
    async () => {
      await cmd.parse([]);
    },
    Error,
    `Missing required option "--flag".`,
  );
});
