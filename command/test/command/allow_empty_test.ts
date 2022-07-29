import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

function cmd() {
  return new Command()
    .throwErrors()
    .option("-f, --flag [value:boolean]", "description ...", {
      required: true,
    });
}

Deno.test("[flags] should not allow empty by default", async () => {
  await assertRejects(
    () => cmd().parse([]),
    Error,
    'Missing required option "--flag".',
  );
});

Deno.test("[flags] should not allow empty if disabled", async () => {
  await assertRejects(
    () => cmd().allowEmpty(false).parse([]),
    Error,
    'Missing required option "--flag".',
  );
});

Deno.test("[flags] should allow empty if enabled", async () => {
  const { options, args } = await cmd()
    .allowEmpty()
    .parse([]);

  assertEquals(options, {});
  assertEquals(args, []);
});

Deno.test("[flags] should allow empty if enabled with true", async () => {
  const { options, args } = await cmd()
    .allowEmpty(true)
    .parse([]);

  assertEquals(options, {});
  assertEquals(args, []);
});
