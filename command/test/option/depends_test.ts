import { test } from "@cliffy/internal/testing/test";
import { assertEquals, assertRejects } from "@std/assert";
import { Command } from "../../command.ts";

function command() {
  return new Command()
    .throwErrors()
    .option("-f, --flag1", "flag 1")
    .option(
      "-F, --flag2 <val:string>",
      "flag 2",
      { depends: ["flag1"], default: "example" },
    );
}

test("command depends option with default value: should accept no arguments", async () => {
  const { options, args } = await command().parse([]);

  assertEquals(options, { flag2: "example" });
  assertEquals(args, []);
});

test({
  name: "command depends option with default value: should accept -h",
  ignore: ["node"],
  fn: async () => {
    const { options, args } = await command().noExit().parse(["-h"]);

    // @TODO: add help & version option types to command.
    assertEquals(options, { flag2: "example", help: true } as unknown);
    assertEquals(args, []);
  },
});

test("command depends option with default value: should accept --flag1", async () => {
  const { options, args } = await command().parse(["--flag1"]);

  assertEquals(options, { flag1: true, flag2: "example" });
  assertEquals(args, []);
});

test("command depends option with default value: should accept --flag1 --flag2 test", async () => {
  const { options, args } = await command().parse(
    ["--flag1", "--flag2", "test"],
  );

  assertEquals(options, { flag1: true, flag2: "test" });
  assertEquals(args, []);
});

test("command depends option with default value: should not accept --flag2 test", async () => {
  await assertRejects(
    async () => {
      await command().parse(["--flag2", "test"]);
    },
    Error,
    `Option "--flag2" depends on option "--flag1".`,
  );
});

test({
  name: "command option should depend on environment variable",
  fn: async () => {
    const cmd = new Command()
      .throwErrors()
      .option("-f, --foo <value:string>", "foo")
      .option("-b, --bar", "bar", {
        depends: ["foo"],
      })
      .env("FOO=<value:string>", "foo");

    Deno.env.set("FOO", "123");

    const { options, args } = await cmd.parse(["--bar"]);

    assertEquals(options, { foo: "123", bar: true });
    assertEquals(args, []);

    Deno.env.delete("FOO");

    await assertRejects(
      () => cmd.parse(["--bar"]),
      Error,
      `Option "--bar" depends on option "--foo".`
    )
  },
});
