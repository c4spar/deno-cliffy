import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

function command(): Command {
  return new Command()
    .throwErrors()
    .version("1.0.0")
    .description("Test description ...")
    .env("SOME_ENV_VAR=<val:number>", "number env var description ...")
    .env("SOME_OTHER_ENV_VAR=<val:boolean>", "boolean env var description ...");
}

Deno.test("command environment variable number", async () => {
  Deno.env.set("SOME_ENV_VAR", "1");

  const cmd: Command = command();
  const { options, args } = await cmd.parse([]);

  assertEquals(options, {});
  assertEquals(args, []);

  Deno.env.set("SOME_ENV_VAR", "");
});

Deno.test("command environment variable invalid number", async () => {
  Deno.env.set("SOME_ENV_VAR", "1a");

  await assertThrowsAsync(
    async () => {
      await command().parse([]);
    },
    Error,
    `Environment variable "SOME_ENV_VAR" must be of type "number", but got "1a".`,
  );

  Deno.env.set("SOME_ENV_VAR", "");
});

Deno.test("command environment variable boolean", async () => {
  Deno.env.set("SOME_OTHER_ENV_VAR", "true");

  const cmd: Command = command();
  const { options, args } = await cmd.parse([]);

  assertEquals(options, {});
  assertEquals(args, []);

  Deno.env.set("SOME_ENV_VAR", "");
});

Deno.test("command environment variable invalid boolean", async () => {
  Deno.env.set("SOME_OTHER_ENV_VAR", "2");

  await assertThrowsAsync(
    async () => {
      await command().parse([]);
    },
    Error,
    `Environment variable "SOME_OTHER_ENV_VAR" must be of type "boolean", but got "2".`,
  );

  Deno.env.set("SOME_ENV_VAR", "");
});
