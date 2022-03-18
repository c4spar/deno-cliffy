// deno-fmt-ignore-file

import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

function command() {
  return new Command()
    .throwErrors()
    .command("global", new Command().command("one"))
    .global()
    .command("global-hidden", new Command().command("two"))
    .global().hidden()
    .command("foo", new Command().command("three"))
    .command("foo-hidden", new Command().command("four"))
    .hidden();
}

Deno.test("command - command - has commands", () => {
  const cmd = command();
  assertEquals(cmd.hasCommands(), true);
  assertEquals(cmd.hasCommands(true), true);
  assertEquals(new Command().hasCommands(), false);
  assertEquals(new Command().hasCommands(true), false);
});

Deno.test("command - command - get commands", () => {
  const cmd = command();
  assertEquals(cmd.getCommands().length, 2);
  assertEquals(cmd.getCommands(true).length, 4);
  assertEquals(!!cmd.getCommands().find((cmd) => cmd.getName() === "global"), true);
  assertEquals(!!cmd.getCommands(true).find((cmd) => cmd.getName() === "global"), true);
  assertEquals(!!cmd.getCommands().find((cmd) => cmd.getName() === "global-hidden"), false);
  assertEquals(!!cmd.getCommands(true).find((cmd) => cmd.getName() === "global-hidden"), true);
  assertEquals(!!cmd.getCommands().find((cmd) => cmd.getName() === "foo"), true);
  assertEquals(!!cmd.getCommands(true).find((cmd) => cmd.getName() === "foo"), true);
  assertEquals(!!cmd.getCommands().find((cmd) => cmd.getName() === "foo-hidden"), false);
  assertEquals(!!cmd.getCommands(true).find((cmd) => cmd.getName() === "foo-hidden"), true);
});

Deno.test("command - command - get base commands", () => {
  const cmd = command();
  assertEquals(cmd.getBaseCommands().length, 2);
  assertEquals(cmd.getBaseCommands(true).length, 4);
  assertEquals(!!cmd.getBaseCommands().find((cmd) => cmd.getName() === "global"), true);
  assertEquals(!!cmd.getBaseCommands(true).find((cmd) => cmd.getName() === "global"), true);
  assertEquals(!!cmd.getBaseCommands().find((cmd) => cmd.getName() === "global-hidden"), false);
  assertEquals(!!cmd.getBaseCommands(true).find((cmd) => cmd.getName() === "global-hidden"), true);
  assertEquals(!!cmd.getBaseCommands().find((cmd) => cmd.getName() === "foo"), true);
  assertEquals(!!cmd.getBaseCommands(true).find((cmd) => cmd.getName() === "foo"), true);
  assertEquals(!!cmd.getBaseCommands().find((cmd) => cmd.getName() === "foo-hidden"), false);
  assertEquals(!!cmd.getBaseCommands(true).find((cmd) => cmd.getName() === "foo-hidden"), true);
});

Deno.test("command - command - get global commands", () => {
  const cmd = command();
  assertEquals(cmd.getCommand("foo")?.getGlobalCommands().length, 1);
  assertEquals(cmd.getCommand("foo")?.getGlobalCommands(true).length, 2);
  assertEquals(!!cmd.getCommand("foo")?.getGlobalCommands().find((cmd) => cmd.getName() === "global"), true);
  assertEquals(!!cmd.getCommand("foo")?.getGlobalCommands(true).find((cmd) => cmd.getName() === "global"), true);
  assertEquals(!!cmd.getCommand("foo")?.getGlobalCommands().find((cmd) => cmd.getName() === "global-hidden"), false);
  assertEquals(!!cmd.getCommand("foo")?.getGlobalCommands(true).find((cmd) => cmd.getName() === "global-hidden"), true);
  assertEquals(!!cmd.getCommand("foo")?.getGlobalCommands().find((cmd) => cmd.getName() === "foo"), false);
  assertEquals(!!cmd.getCommand("foo")?.getGlobalCommands(true).find((cmd) => cmd.getName() === "foo"), false);
  assertEquals(!!cmd.getCommand("foo")?.getGlobalCommands().find((cmd) => cmd.getName() === "foo-hidden"), false);
  assertEquals(!!cmd.getCommand("foo")?.getGlobalCommands(true).find((cmd) => cmd.getName() === "foo-hidden"), false);
});

Deno.test("command - command - has command", () => {
  const cmd = command();
  assertEquals(cmd.hasCommand("global"), true);
  assertEquals(cmd.hasCommand("global-hidden"), false);
  assertEquals(cmd.hasCommand("global-hidden", true), true);
  assertEquals(cmd.hasCommand("foo"), true);
  assertEquals(cmd.hasCommand("foo-hidden"), false);
  assertEquals(cmd.hasCommand("foo-hidden", true), true);
  assertEquals(cmd.hasCommand("unknown"), false);
  assertEquals(cmd.getCommand("foo")?.hasCommand("global"), true);
  assertEquals(cmd.getCommand("foo")?.hasCommand("global-hidden"), false);
  assertEquals(cmd.getCommand("foo")?.hasCommand("global-hidden", true), true);
  assertEquals(cmd.getCommand("foo")?.hasCommand("unknown"), false);
  assertEquals(cmd.getCommand("foo")?.getCommand("three")?.hasCommand("global"), true);
  assertEquals(cmd.getCommand("foo")?.getCommand("three")?.hasCommand("global-hidden"), false);
  assertEquals(cmd.getCommand("foo")?.getCommand("three")?.hasCommand("global-hidden", true), true);
  assertEquals(cmd.getCommand("foo")?.getCommand("three")?.hasCommand("unknown"), false);
});

Deno.test("command - command - get command", () => {
  const cmd = command();
  assertEquals(cmd.getCommand("global")?.getName(), "global");
  assertEquals(cmd.getCommand("global-hidden")?.getName(), undefined);
  assertEquals(cmd.getCommand("global-hidden", true)?.getName(), "global-hidden");
  assertEquals(cmd.getCommand("foo")?.getName(), "foo");
  assertEquals(cmd.getCommand("foo-hidden")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo-hidden", true)?.getName(), "foo-hidden");
  assertEquals(cmd.getCommand("unknown")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getCommand("global")?.getName(), "global");
  assertEquals(cmd.getCommand("foo")?.getCommand("global-hidden")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getCommand("global-hidden", true)?.getName(), "global-hidden");
  assertEquals(cmd.getCommand("foo")?.getCommand("unknown")?.getName(), undefined);
});

Deno.test("command - command - get base command", () => {
  const cmd = command();
  assertEquals(cmd.getBaseCommand("global")?.getName(), "global");
  assertEquals(cmd.getBaseCommand("global-hidden")?.getName(), undefined);
  assertEquals(cmd.getBaseCommand("global-hidden", true)?.getName(), "global-hidden");
  assertEquals(cmd.getBaseCommand("foo")?.getName(), "foo");
  assertEquals(cmd.getBaseCommand("foo-hidden")?.getName(), undefined);
  assertEquals(cmd.getBaseCommand("foo-hidden", true)?.getName(), "foo-hidden");
  assertEquals(cmd.getBaseCommand("unknown")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getBaseCommand("global")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getBaseCommand("global-hidden")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getBaseCommand("global-hidden", true)?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getBaseCommand("unknown")?.getName(), undefined);
});

Deno.test("command - command - get global command", () => {
  const cmd = command();
  assertEquals(cmd.getGlobalCommand("global")?.getName(), undefined);
  assertEquals(cmd.getGlobalCommand("global-hidden")?.getName(), undefined);
  assertEquals(cmd.getGlobalCommand("global-hidden", true)?.getName(), undefined);
  assertEquals(cmd.getGlobalCommand("foo")?.getName(), undefined);
  assertEquals(cmd.getGlobalCommand("foo-hidden")?.getName(), undefined);
  assertEquals(cmd.getGlobalCommand("foo-hidden", true)?.getName(), undefined);
  assertEquals(cmd.getGlobalCommand("unknown")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getGlobalCommand("global")?.getName(), "global");
  assertEquals(cmd.getCommand("foo")?.getGlobalCommand("global-hidden")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getGlobalCommand("global-hidden", true)?.getName(), "global-hidden");
  assertEquals(cmd.getCommand("foo")?.getGlobalCommand("foo")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getGlobalCommand("foo-hidden")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getGlobalCommand("foo-hidden", true)?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getGlobalCommand("unknown")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getCommand("three")?.getGlobalCommand("global")?.getName(), "global");
  assertEquals(cmd.getCommand("foo")?.getCommand("three")?.getGlobalCommand("global-hidden")?.getName(), undefined);
  assertEquals(cmd.getCommand("foo")?.getCommand("three")?.getGlobalCommand("global-hidden", true)?.getName(), "global-hidden");
  assertEquals(cmd.getCommand("foo")?.getCommand("three")?.getGlobalCommand("unknown")?.getName(), undefined);
});

Deno.test("command - command - remove command", () => {
  const cmd = command();
  assertEquals(cmd.getCommand("foo")?.getName(), "foo");
  assertEquals(cmd.removeCommand("foo")?.getName(), "foo");
  assertEquals(cmd.getCommand("foo"), undefined);
  assertEquals(cmd.removeCommand("foo"), undefined);
});
