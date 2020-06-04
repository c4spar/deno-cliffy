import { assertThrows } from "../../../flags/test/lib/assert.ts";
import { Command } from "../../lib/command.ts";
import { assertEquals } from "../lib/assert.ts";

const cmd: Command = new Command()
  .throwErrors()
  .option("--flag1", "flag 1")
  .option(
    "--flag2 <val:string>",
    "flag 2",
    { depends: ["flag1"], default: "example" },
  );

Deno.test("command depends option with default value: should accept no arguments", async () => {
  const { options, args } = await cmd.parse([]);

  assertEquals(options, { flag2: "example" });
  assertEquals(args, []);
});

Deno.test("command depends option with default value: should accept -h", async () => {
  const { options, args } = await cmd.parse(["-h"]);

  assertEquals(options, { flag2: "example" });
  assertEquals(args, []);
});

Deno.test("command depends option with default value: should accept --flag1", async () => {
  const { options, args } = await cmd.parse(["--flag1"]);

  assertEquals(options, { flag1: true, flag2: "example" });
  assertEquals(args, []);
});

Deno.test("command depends option with default value: should accept --flag1 --flag2 test", async () => {
  const { options, args } = await cmd.parse(["--flag1", "--flag2", "test"]);

  assertEquals(options, { flag1: true, flag2: "test" });
  assertEquals(args, []);
});

Deno.test("command depends option with default value: should not accept --flag2 test", async () => {
  assertThrows(
    () => cmd.parse(["--flag2", "test"]),
    Error,
    "Option --flag2 depends on option: --flag1",
  );
});
