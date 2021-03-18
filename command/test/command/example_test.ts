// deno-fmt-ignore-file

import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import type { IExample } from "../../types.ts";

function command(): Command {
  return new Command()
    .throwErrors()
    .example("foo", "...")
    .command("bar");
}

Deno.test("command - example - example properties", () => {
  const cmd: Command = new Command()
    .throwErrors()
    .example("foo", "foo ...");
  const example: IExample = cmd.getExample("foo") as IExample;
  assertEquals(example.name, "foo");
  assertEquals(example.description, "foo ...");
});

Deno.test("command - example - has examples", () => {
  const cmd: Command = command();
  assertEquals(cmd.hasExamples(), true);
  assertEquals(new Command().hasExamples(), false);
});

Deno.test("command - example - get examples", () => {
  const cmd: Command = command();
  assertEquals(cmd.getExamples().length, 1);
  assertEquals(!!cmd.getExamples().find((opt) => opt.name === "foo"), true);
});

Deno.test("command - example - has example", () => {
  const cmd: Command = command();
  assertEquals(cmd.hasExample("foo"), true);
  assertEquals(cmd.hasExample("unknown"), false);
  assertEquals(cmd.getCommand("bar")?.hasExample("foo"), false);
  assertEquals(cmd.getCommand("bar")?.hasExample("unknown"), false);
});

Deno.test("command - example - get example", () => {
  const cmd: Command = command();
  assertEquals(cmd.getExample("foo")?.name, "foo");
  assertEquals(cmd.getExample("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getExample("foo")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getExample("unknown")?.name, undefined);
});
