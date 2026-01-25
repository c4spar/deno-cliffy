import { test } from "@cliffy/internal/testing/test";
import { assertEquals, assertRejects } from "@std/assert";
import { ValidationError } from "../../_errors.ts";
import { Command } from "../../command.ts";
import { assertType, type IsExact } from "@std/testing/types";

test("should accept a dash as argument", async () => {
  const { args } = await new Command()
    .throwErrors()
    .argument("<input:string>", "...")
    .parse(["-"]);

  assertType<IsExact<typeof args, [string]>>(true);
  assertEquals(args, ["-"]);
});

test("should parse correctly argument types", async () => {
  const { args } = await new Command()
    .throwErrors()
    .argument("<foo:string>", "...")
    .argument("[bar:number]", "...")
    .argument("[baz:boolean]", "...")
    .argument("[list:number[]]", "...")
    .parse([
      "abc",
      "123",
      "true",
      "1,2,3,4",
    ]);

  assertType<IsExact<typeof args, [string, number?, boolean?, Array<number>?]>>(
    true,
  );
  assertEquals(args, ["abc", 123, true, [1, 2, 3, 4]]);
});

test("should parse correctly argument types on sub command", async () => {
  const { args } = await new Command()
    .throwErrors()
    .command("foo", "...")
    .argument("<foo:string>", "...")
    .argument("[bar:number]", "...")
    .argument("[baz:boolean]", "...")
    .argument("[list:number[]]", "...")
    .parse([
      "foo",
      "abc",
      "123",
      "true",
      "1,2,3,4",
    ]);

  assertType<IsExact<typeof args, Array<unknown>>>(true);
  assertEquals(args, ["abc", 123, true, [1, 2, 3, 4]]);
});

test("should parse correctly a variadic argument", async () => {
  const { args } = await new Command()
    .throwErrors()
    .argument("<...foo:string>", "...")
    .parse(["foo", "bar", "baz"]);

  assertType<IsExact<typeof args, [string, ...Array<string>]>>(true);
  assertEquals(args, ["foo", "bar", "baz"]);
});

test("should parse correctly a variadic argument with other args", async () => {
  const { args } = await new Command()
    .throwErrors()
    .argument("<foo:string>", "...")
    .argument("[...bar:number]", "...")
    .parse(["abc", "1", "2", "3"]);

  assertType<IsExact<typeof args, [string, ...Array<number>]>>(true);
  assertEquals(args, ["abc", 1, 2, 3]);
});

test("should parse correctly a required variadic argument with other args", async () => {
  const { args } = await new Command()
    .throwErrors()
    .argument("<foo:string>", "...")
    .argument("<...bar:number>", "...")
    .parse(["abc", "1", "2", "3"]);

  assertType<IsExact<typeof args, [string, number, ...Array<number>]>>(true);
  assertEquals(args, ["abc", 1, 2, 3]);
});

test("should throw on missing required argument", async () => {
  const command = new Command()
    .throwErrors()
    .argument("<foo:string>", "...")
    .argument("<bar:string>", "...");

  await assertRejects(
    () => command.parse(["only-one-arg"]),
    ValidationError,
    "Missing argument: bar",
  );
});

test("should throw on invalid argument type", async () => {
  const command = new Command()
    .throwErrors()
    .argument("<foo:number>", "...");

  await assertRejects(
    () => command.parse(["not-a-number"]),
    ValidationError,
    'Argument "foo" must be of type "number", but got "not-a-number".',
  );
});

test("should throw on invalid variadic argument type", async () => {
  const command = new Command()
    .throwErrors()
    .argument("<...foo:number>", "...");

  await assertRejects(
    () => command.parse(["1", "2", "three"]),
    ValidationError,
    'Argument "foo" must be of type "number", but got "three".',
  );
});
