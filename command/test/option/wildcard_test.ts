import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

function cmd() {
  return new Command()
    .throwErrors()
    .option("--option1.*", "...")
    .option("--option2.*.*", "...");
}

Deno.test("[command] wildcard - should allow second level wildcard option", async () => {
  const { options, args } = await cmd().parse(["--option1.foo"]);
  assertEquals(options, { option1: { foo: true } });
  assertEquals(args, []);
});

Deno.test("[command] wildcard - should not allow second level wildcard option", async () => {
  await assertRejects(
    () => cmd().parse(["--option2.foo"]),
    Error,
    `Unknown option "--option2.foo". Did you mean option "--option2.*.*"?`,
  );
});

Deno.test("[command] wildcard - should allow third level wildcard option", async () => {
  const { options, args } = await cmd().parse(["--option2.foo.bar"]);
  assertEquals(options, { option2: { foo: { bar: true } } });
  assertEquals(args, []);
});

Deno.test("[command] wildcard - should not allow third level wildcard option", async () => {
  await assertRejects(
    () => cmd().parse(["--option1.foo.bar"]),
    Error,
    `Unknown option "--option1.foo.bar". Did you mean option "--option1.*"?`,
  );
});
