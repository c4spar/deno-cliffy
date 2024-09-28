import { test } from "@cliffy/internal/testing/test";
import { assertEquals, assertRejects } from "@std/assert";
import { Command } from "../../command.ts";

test("command - version - version string", () => {
  const cmd = new Command()
    .throwErrors()
    .version("version: xxx")
    .command("foo")
    .command("bar");

  assertEquals(cmd.getVersion(), "version: xxx");
  assertEquals(cmd.getCommand("foo")?.getVersion(), "version: xxx");
  assertEquals(cmd.getCommand("bar")?.getVersion(), "version: xxx");
});

test("command - version - version handler", () => {
  const cmd = new Command()
    .throwErrors()
    .name("main")
    .version(function () {
      return `version: ${this.getName()}`;
    })
    .command("foo")
    .command("bar");

  assertEquals(cmd.getVersion(), "version: main");
  assertEquals(cmd.getCommand("foo")?.getVersion(), "version: foo");
  assertEquals(cmd.getCommand("bar")?.getVersion(), "version: bar");
});

test("command - version - override version", () => {
  const cmd = new Command()
    .throwErrors()
    .name("main")
    .version(function () {
      return `version: ${this.getName()}`;
    })
    .command("foo")
    .version(`foo version`)
    .command("bar")
    .version(() => `bar version`)
    .reset();

  assertEquals(cmd.getVersion(), "version: main");
  assertEquals(cmd.getCommand("foo")?.getVersion(), "foo version");
  assertEquals(cmd.getCommand("bar")?.getVersion(), "bar version");
});

test("command - version - version option", async () => {
  let called = 0;
  const cmd = new Command()
    .throwErrors()
    .version("0.1.0")
    .versionOption("-x, --x-version", "", () => {
      called++;
    })
    .command("foo", new Command().command("foo-foo"))
    .command("bar");

  await cmd.parse(["-x"]);
  assertEquals(called, 1);

  await assertRejects(
    () => cmd.parse(["foo", "-x"]),
    Error,
    `Unknown option "-x". Did you mean option "-h"?`,
  );
});

test("command - version - global version option", async () => {
  let called = 0;
  const cmd = new Command()
    .throwErrors()
    .version("0.1.0")
    .versionOption("-x, --x-version", "", {
      global: true,
      action: () => {
        called++;
      },
    })
    .command("foo", new Command().command("foo-foo"))
    .command("bar");

  await cmd.parse(["-x"]);
  assertEquals(called, 1);
  await cmd.parse(["foo", "-x"]);
  assertEquals(called, 2);
  await cmd.parse(["foo", "foo-foo", "-x"]);
  assertEquals(called, 3);
  await cmd.parse(["bar", "-x"]);
  assertEquals(called, 4);
});
