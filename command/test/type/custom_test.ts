import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import type { ArgumentValue, TypeHandler } from "../../types.ts";
import { Type } from "../../type.ts";

function email(): TypeHandler<string> {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return ({ label, value, name }: ArgumentValue): string => {
    if (!emailRegex.test(value.toLowerCase())) {
      throw new Error(
        `${label} "${name}" must be a valid "email", but got "${value}".`,
      );
    }

    return value;
  };
}

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
  await assertRejects(
    () => cmd.parse(["init", "-e", "my@email.com"]),
    Error,
    `Unknown type "email". Did you mean type "email2"?`,
  );
});

Deno.test("command - type - custom - with invalid value", async () => {
  await assertRejects(
    () => cmd.parse(["-E", "my @email.com"]),
    Error,
    `Option "--email2" must be a valid "email", but got "my @email.com".`,
  );
});

Deno.test("command - type - custom - with invalid value on child command", async () => {
  await assertRejects(
    () => cmd.parse(["init", "-E", "my @email.com"]),
    Error,
    `Option "--email2" must be a valid "email", but got "my @email.com".`,
  );
});

class CustomType<TType extends string> extends Type<TType> {
  constructor(private formats: ReadonlyArray<TType>) {
    super();
  }

  parse(type: ArgumentValue): TType {
    if (!this.formats.includes(type.value as TType)) {
      throw new Error(`invalid type: ${type.value}`);
    }
    return type.value as TType;
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
      format === "xyz";
      format === "foo";
      format === "bar";
    });

  const { options } = await cmd.parse(["-f", "foo"]);
  assertEquals(options, { format: "foo" });

  await assertRejects(
    () => cmd.parse(["-f", "xyz"]),
    Error,
    `invalid type: xyz`,
  );
});
