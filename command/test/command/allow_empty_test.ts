import { test } from "@cliffy/internal/testing/test";
import { assertEquals, assertRejects } from "@std/assert";
import { Command } from "../../command.ts";

function cmd() {
  return new Command()
    .throwErrors()
    .option("-f, --flag [value:boolean]", "description ...", {
      required: true,
    });
}

test("[flags] should not allow empty by default", async () => {
  await assertRejects(
    () => cmd().parse([]),
    Error,
    'Missing required option "--flag".',
  );
});

test("[flags] should not allow empty if disabled", async () => {
  await assertRejects(
    () => cmd().allowEmpty(false).parse([]),
    Error,
    'Missing required option "--flag".',
  );
});

test("[flags] should allow empty if enabled", async () => {
  const { options, args } = await cmd()
    .allowEmpty()
    .parse([]);

  assertEquals(options, {});
  assertEquals(args, []);
});

test("[flags] should allow empty if enabled with true", async () => {
  const { options, args } = await cmd()
    .allowEmpty(true)
    .parse([]);

  assertEquals(options, {});
  assertEquals(args, []);
});
