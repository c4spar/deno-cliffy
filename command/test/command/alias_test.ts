import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

Deno.test("command - alias - command with alias", async () => {
  const cmd = new Command()
    .throwErrors()
    .command("foo, bar")
    .option("-b, --baz", "...");

  const { options: fooOptions } = await cmd.parse(["foo", "-b"]);
  const { options: barOptions } = await cmd.parse(["bar", "-b"]);

  assertEquals(fooOptions, { baz: true });
  assertEquals(barOptions, { baz: true });
});

Deno.test("command - alias - command with alias method", async () => {
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
