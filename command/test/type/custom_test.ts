import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import { ITypeInfo, ITypeHandler } from "../../types.ts";

const email = (): ITypeHandler<string> => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return ({ label, value, name }: ITypeInfo): string => {
    if (!emailRegex.test(value.toLowerCase())) {
      throw new Error(
        `${label} ${name} must be a valid email but got: ${value}`,
      );
    }

    return value;
  };
};

const cmd = new Command()
  .throwErrors()
  .type("email", email())
  .type("email2", email(), { global: true })
  .option("-e, --email [value:email]", "description ...")
  .option("-E, --email2 [value:email2]", "description ...")
  .command("init")
  .option("-e, --admin-email [value:email]", "description ...")
  .option("-E, --email2 [value:email2]", "description ...")
  .description("...")
  .action(() => {});

Deno.test("command with custom type", async () => {
  const { options, args } = await cmd.parse(["-e", "my@email.com"]);

  assertEquals(options, { email: "my@email.com" });
  assertEquals(args, []);
});

Deno.test("command with global custom type", async () => {
  const { options, args } = await cmd.parse(["-E", "my@email.com"]);

  assertEquals(options, { email2: "my@email.com" });
  assertEquals(args, []);
});

Deno.test("sub command global custom type", async () => {
  const { options, args } = await cmd.parse(["init", "-E", "my@email.com"]);

  assertEquals(options, { email2: "my@email.com" });
  assertEquals(args, []);
});

Deno.test("sub command none global custom type", async () => {
  await assertThrowsAsync(
    async () => {
      await cmd.parse(["init", "-e", "my@email.com"]);
    },
    Error,
    "No type registered with name: email",
  );
});

Deno.test("sub command with global custom type and invalid value", async () => {
  await assertThrowsAsync(
    async () => {
      await cmd.parse(["init", "-E", "my @email.com"]);
    },
    Error,
    "Option --email2 must be a valid email but got: my @email.com",
  );
});
