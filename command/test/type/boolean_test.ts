import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .name("test-command")
  .option("-f, --flag [value:boolean]", "description ...")
  .option("--no-flag", "description ...")
  .action(() => {});

Deno.test("command typeString flag", async () => {
  const { options, args } = await cmd.parse(["-f"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["--flag"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["-f", "true"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["--flag", "true"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["-f", "false"]);

  assertEquals(options, { flag: false });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["--flag", "false"]);

  assertEquals(options, { flag: false });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["-f", "1"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["--flag", "1"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["-f", "0"]);

  assertEquals(options, { flag: false });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["--flag", "0"]);

  assertEquals(options, { flag: false });
  assertEquals(args, []);
});

Deno.test("command typeString flagValue", async () => {
  const { options, args } = await cmd.parse(["--no-flag"]);

  assertEquals(options, { flag: false });
  assertEquals(args, []);
});

Deno.test("command optionStandalone flagCombineLong", async () => {
  await assertThrowsAsync(
    async () => {
      await cmd.parse(["-f", "true", "unknown"]);
    },
    Error,
    "No arguments allowed for command: test-command",
  );
});

Deno.test("command optionStandalone flagCombineLong", async () => {
  await assertThrowsAsync(
    async () => {
      await cmd.parse(["-f", "unknown"]);
    },
    Error,
    "Option --flag must be of type boolean but got: unknown",
  );
});
