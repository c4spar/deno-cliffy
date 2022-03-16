import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .option("-f, --flag [value:string]", "description ...")
  .option("--no-flag", "description ...")
  .action(() => {});

Deno.test("command - type - string - with no value", async () => {
  const { options, args } = await cmd.parse(["-f"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command - type - string - with valid value", async () => {
  const { options, args } = await cmd.parse(["--flag", "value"]);

  assertEquals(options, { flag: "value" });
  assertEquals(args, []);
});

Deno.test("command - type - string - no arguments allowed", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "value", "unknown"]);
    },
    Error,
    `No arguments allowed for command "COMMAND".`,
  );
});
