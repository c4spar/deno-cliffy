// deno-fmt-ignore-file

import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import type { ICompletion } from "../../types.ts";

function command(): Command {
  return new Command()
    .throwErrors()
    .globalComplete("global", () => ["global1", "global2"])
    .complete("foo", () => ["foo1", "foo2"])
    .command(
      "bar",
      new Command()
        .complete("bar", () => ["bar1", "bar2"])
        .command("baz")
        .complete("baz", () => ["baz1", "baz2"])
    );
}

Deno.test("command - completion - completion properties", () => {
  const cmd: Command = new Command()
    .throwErrors()
    .complete("foo", () => ["foo1", "foo2"])
    .complete("bar", () => ["bar1", "bar2"], {
      global: true,
      override: true,
    });
  const fooCompletion: ICompletion = cmd.getCompletion("foo") as ICompletion;
  const barCompletion: ICompletion = cmd.getCompletion("bar") as ICompletion;
  assertEquals(fooCompletion.name, "foo");
  assertEquals(fooCompletion.global, undefined);
  assertEquals(barCompletion.name, "bar");
  assertEquals(barCompletion.global, true);
});

Deno.test("command - completion - get completions", () => {
  const cmd: Command = command();
  assertEquals(cmd.getCompletions().length, 2);
  assertEquals(!!cmd.getCompletions().find((opt) => opt.name === "global"), true);
  assertEquals(!!cmd.getCompletions().find((opt) => opt.name === "foo"), true);
});

Deno.test("command - completion - get base completions", () => {
  const cmd: Command = command();
  assertEquals(cmd.getBaseCompletions().length, 2);
  assertEquals(!!cmd.getBaseCompletions().find((opt) => opt.name === "global"), true);
  assertEquals(!!cmd.getBaseCompletions().find((opt) => opt.name === "foo"), true);
});

Deno.test("command - completion - get global completions", () => {
  const cmd: Command = command();
  assertEquals(cmd.getCommand("bar")?.getGlobalCompletions().length, 1);
  assertEquals(!!cmd.getCommand("bar")?.getGlobalCompletions().find((opt) => opt.name === "global"), true);
  assertEquals(!!cmd.getCommand("bar")?.getGlobalCompletions().find((opt) => opt.name === "foo"), false);
});

Deno.test("command - completion - get completion", () => {
  const cmd: Command = command();
  assertEquals(cmd.getCompletion("global")?.name, "global");
  assertEquals(cmd.getCompletion("foo")?.name, "foo");
  assertEquals(cmd.getCompletion("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCompletion("global")?.name, "global");
  assertEquals(cmd.getCommand("bar")?.getCompletion("bar")?.name, "bar");
  assertEquals(cmd.getCommand("bar")?.getCompletion("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getCompletion("global")?.name, "global");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getCompletion("baz")?.name, "baz");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getCompletion("unknown")?.name, undefined);
});

Deno.test("command - completion - get base completion", () => {
  const cmd: Command = command();
  assertEquals(cmd.getBaseCompletion("global")?.name, "global");
  assertEquals(cmd.getBaseCompletion("foo")?.name, "foo");
  assertEquals(cmd.getBaseCompletion("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getBaseCompletion("global")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getBaseCompletion("bar")?.name, "bar");
  assertEquals(cmd.getCommand("bar")?.getBaseCompletion("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getBaseCompletion("global")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getBaseCompletion("baz")?.name, "baz");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getBaseCompletion("unknown")?.name, undefined);
});

Deno.test("command - completion - get global completion", () => {
  const cmd: Command = command();
  assertEquals(cmd.getGlobalCompletion("global")?.name, undefined);
  assertEquals(cmd.getGlobalCompletion("foo")?.name, undefined);
  assertEquals(cmd.getGlobalCompletion("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getGlobalCompletion("global")?.name, "global");
  assertEquals(cmd.getCommand("bar")?.getGlobalCompletion("bar")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getGlobalCompletion("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getGlobalCompletion("global")?.name, "global");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getGlobalCompletion("baz")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getGlobalCompletion("unknown")?.name, undefined);
});
