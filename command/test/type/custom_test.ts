import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import type { ITypeHandler, ITypeInfo } from "../../types.ts";
import { Type } from "../../type.ts";

const email = (): ITypeHandler<string> => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return ({ label, value, name }: ITypeInfo): string => {
    if (!emailRegex.test(value.toLowerCase())) {
      throw new Error(
        `${label} "${name}" must be a valid "email", but got "${value}".`,
      );
    }

    return value;
  };
};

const cmd = new Command()
  .throwErrors()
  .type("email", email())
  .globalType("email2", email())
  .option("-e, --email [value:email]", "description ...")
  .option("-E, --email2 [value:email2]", "description ...")
  .command("init")
  .option("-e, --admin-email [value:email]", "description ...")
  .option("-E, --email2 [value:email2]", "description ...")
  .description("...")
  .action(() => {});

Deno.test("command - type - custom - with valid value", async () => {
  const { options, args } = await cmd.parse(["-e", "my@email.com"]);

  assertEquals(options, { email: "my@email.com" });
  assertEquals(args, []);
});

Deno.test("command - type - custom - long flag with valid value", async () => {
  const { options, args } = await cmd.parse(["-E", "my@email.com"]);

  assertEquals(options, { email2: "my@email.com" });
  assertEquals(args, []);
});

Deno.test("command - type - custom - child command with valid value", async () => {
  const { options, args } = await cmd.parse(["init", "-E", "my@email.com"]);

  assertEquals(options, { email2: "my@email.com" });
  assertEquals(args, []);
});

Deno.test("command - type - custom - with unknown type", async () => {
  await assertThrowsAsync(
    () => cmd.parse(["init", "-e", "my@email.com"]),
    Error,
    `Unknown type "email". Did you mean type "email2"?`,
  );
});

Deno.test("command - type - custom - with invalid value", async () => {
  await assertThrowsAsync(
    () => cmd.parse(["-E", "my @email.com"]),
    Error,
    `Option "--email2" must be a valid "email", but got "my @email.com".`,
  );
});

Deno.test("command - type - custom - with invalid value on child command", async () => {
  await assertThrowsAsync(
    () => cmd.parse(["init", "-E", "my @email.com"]),
    Error,
    `Option "--email2" must be a valid "email", but got "my @email.com".`,
  );
});

class CustomType<T extends string> extends Type<T> {
  constructor(private formats: ReadonlyArray<T>) {
    super();
  }

  parse(type: ITypeInfo): T {
    if (!this.formats.includes(type.value as T)) {
      throw new Error(`invalid type: ${type.value}`);
    }
    return type.value as T;
  }
}

Deno.test("command - type - custom - generic custom type", async () => {
  const cmd = new Command()
    .throwErrors()
    .type("format", new CustomType(["foo", "bar"]))
    .option(
      "-f, --format [format:format]",
      "...",
    )
    .action(({ format }) => {
      // @ts-expect-error format cannot be xyz
      format === "xyz";
      format === "foo";
      format === "bar";
    });

  const { options } = await cmd.parse(["-f", "foo"]);
  assertEquals(options, { format: "foo" });

  await assertThrowsAsync(
    () => cmd.parse(["-f", "xyz"]),
    Error,
    `invalid type: xyz`,
  );
});
