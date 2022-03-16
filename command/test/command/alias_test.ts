import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

Deno.test("command - alias - command with alias 1", async () => {
  const cmd = new Command()
    .throwErrors()
    .command("foo, bar")
    .option("-b, --baz", "...");

  const { options: fooOptions } = await cmd.parse(["foo", "-b"]);
  const { options: barOptions } = await cmd.parse(["bar", "-b"]);

  assertEquals(fooOptions, { baz: true });
  assertEquals(barOptions, { baz: true });
});

Deno.test("command - alias - command with alias 2", async () => {
  const cmd = new Command()
    .throwErrors()
    .command("foo")
    .alias("bar")
    .option("-b, --baz", "...");

  const { options: fooOptions } = await cmd.parse(["foo", "-b"]);
  const { options: barOptions } = await cmd.parse(["bar", "-b"]);

  assertEquals(fooOptions, { baz: true });
  assertEquals(barOptions, { baz: true });
});

Deno.test("command - alias - duplicate command alias name 1", async () => {
  await assertRejects(
    async () => {
      await new Command()
        .throwErrors()
        .command("foo, foo")
        .parse([]);
    },
    Error,
    `Duplicate command alias "foo".`,
  );
});

Deno.test("command - alias - duplicate command alias name 2", async () => {
  await assertRejects(
    async () => {
      await new Command()
        .throwErrors()
        .command("foo")
        .alias("foo")
        .parse([]);
    },
    Error,
    `Duplicate command alias "foo".`,
  );
});
