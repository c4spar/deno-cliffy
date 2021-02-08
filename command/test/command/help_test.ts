import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

Deno.test("command help handler", () => {
  const cmd = new Command()
    .throwErrors()
    .name("main")
    .help(function () {
      return `help: ${this.getName()}`;
    })
    .command("foo")
    .command("bar")
    .reset();

  assertEquals(cmd.getHelp(), "help: main");
  assertEquals(cmd.getCommand("foo")?.getHelp(), "help: foo");
  assertEquals(cmd.getCommand("bar")?.getHelp(), "help: bar");
});

Deno.test("command help handler override", () => {
  const cmd = new Command()
    .throwErrors()
    .name("main")
    .help(function () {
      return `help: ${this.getName()}`;
    })
    .command("foo")
    .help(`foo help`)
    .command("bar")
    .help(() => `bar help`)
    .reset();

  assertEquals(cmd.getHelp(), "help: main");
  assertEquals(cmd.getCommand("foo")?.getHelp(), "foo help");
  assertEquals(cmd.getCommand("bar")?.getHelp(), "bar help");
});
