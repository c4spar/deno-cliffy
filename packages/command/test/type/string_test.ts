import { Command } from "../../lib/command.ts";
import { assertEquals, assertThrowsAsync } from "../lib/assert.ts";

const cmd = new Command()
  .throwErrors()
  .option("-f, --flag [value:string]", "description ...").action(() => {});

Deno.test("command typeString flag", async () => {
  const { options, args } = await cmd.parse(["-f"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["--flag", "value"]);

  assertEquals(options, { flag: "value" });
  assertEquals(args, []);
});

Deno.test("command optionStandalone flagCombineLong", async () => {
  await assertThrowsAsync(
    async () => {
      await cmd.parse(["-f", "value", "unknown"]);
    },
    Error,
    "Unknown command: unknown",
  );
});
