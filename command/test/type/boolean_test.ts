import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .name("test-command")
  .arguments("[foo]")
  .option("-f, --flag [value:boolean]", "description ...")
  .option("--no-flag", "description ...")
  .action(() => {});

const cmd2 = new Command()
  .throwErrors()
  .name("test-command")
  .option("-f, --flag [value:boolean]", "description ...")
  .action(() => {});

const cmd3 = new Command()
  .throwErrors()
  .name("test-command")
  .option("-f, --check", "description ...")
  .option("--no-check", "description ...")
  .option("-a, --color <color>", "description ...")
  .action(() => {});

Deno.test("command - type - boolean - with no value", async () => {
  const { options, args } = await cmd.parse(["-f"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command - type - boolean - long flag with no value", async () => {
  const { options, args } = await cmd.parse(["--flag"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command - type - boolean - with true value", async () => {
  const { options, args } = await cmd.parse(["-f", "true"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command - type - boolean - long flag with true value", async () => {
  const { options, args } = await cmd.parse(["--flag", "true"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command - type - boolean - with false value", async () => {
  const { options, args } = await cmd.parse(["-f", "false"]);

  assertEquals(options, { flag: false });
  assertEquals(args, []);
});

Deno.test("command - type - boolean - long flag with false value and argument", async () => {
  const { options, args } = await cmd.parse(["--flag", "false", "unknown"]);

  assertEquals(options, { flag: false });
  assertEquals(args, ["unknown"]);
});

Deno.test("command - type - boolean - with 1 value", async () => {
  const { options, args } = await cmd.parse(["-f", "1"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command - type - boolean - long flag with 1 value", async () => {
  const { options, args } = await cmd.parse(["--flag", "1"]);

  assertEquals(options, { flag: true });
  assertEquals(args, []);
});

Deno.test("command - type - boolean - with 0 value", async () => {
  const { options, args } = await cmd.parse(["-f", "0"]);

  assertEquals(options, { flag: false });
  assertEquals(args, []);
});

Deno.test("command - type - boolean - long flag with 0 value and argument", async () => {
  const { options, args } = await cmd.parse(["--flag", "0", "unknown"]);

  assertEquals(options, { flag: false });
  assertEquals(args, ["unknown"]);
});

Deno.test("command - type - boolean - negatable option with argument", async () => {
  const { options, args } = await cmd.parse(["--no-flag", "unknown"]);

  assertEquals(options, { flag: false });
  assertEquals(args, ["unknown"]);
});

Deno.test("command - type - boolean - with invalid value", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "unknown"]);
    },
    Error,
    `Option "--flag" must be of type "boolean", but got "unknown".`,
  );
});

Deno.test("command - type - boolean - no arguments allowed", async () => {
  await assertRejects(
    async () => {
      await cmd2.parse(["-f", "true", "unknown"]);
    },
    Error,
    `No arguments allowed for command "test-command".`,
  );
});

Deno.test("command - type - boolean - negatable option last", async () => {
  const { options, args } = await cmd3.parse(["--color", "red", "--no-check"]);

  assertEquals(options, { color: "red", check: false });
  assertEquals(args, []);
});

Deno.test("command - type - boolean - negatable option first", async () => {
  const { options, args } = await cmd3.parse(["--no-check", "--color", "red"]);

  assertEquals(options, { color: "red", check: false });
  assertEquals(args, []);
});
