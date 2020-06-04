import { Command } from "../../lib/command.ts";
import { assertEquals, assertThrowsAsync } from "../lib/assert.ts";

const cmd = new Command()
  .throwErrors()
  .allowEmpty(false)
  .option("-f, --flag [value:string]", "description ...", { required: true })
  .action(() => {});

Deno.test("command optionRequired", async () => {
  const { options, args } = await cmd.parse(["-f", "value"]);

  assertEquals(options, { flag: "value" });
  assertEquals(args, []);
});

Deno.test("command optionRequired noArguments", async () => {
  await assertThrowsAsync(
    async () => {
      await cmd.parse([]);
    },
    Error,
    "Missing required option: --flag",
  );
});
