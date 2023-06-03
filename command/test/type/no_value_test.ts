import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import { HelpCommand } from "../../help/help_command.ts";

const cmd = new Command()
  .throwErrors()
  .option("-f, --flag", "description ...")
  .action(() => {})
  .command("help", new HelpCommand());

Deno.test("command - type - no value - short flag without argument", async () => {
  const { options, args } = await cmd.parse(["-f"]);
  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command - type - no value - long flag without argument", async () => {
  const { options, args } = await cmd.parse(["--flag"]);
  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command - type - no value - short flag with argument", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "true"]);
    },
    Error,
    `Unknown command "true". Did you mean command "help"?`,
  );
});

Deno.test("command - type - no value - long flag with argument", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["--flag", "true"]);
    },
    Error,
    `Unknown command "true". Did you mean command "help"?`,
  );
});
