import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .option("-o, --optional [value...:number]", "description ...")
  .option("-b, --boolean <value...:boolean>", "description ...")
  .option("-s, --string <value...:string>", "description ...")
  .option("-n, --number <value...:number>", "description ...")
  .option(
    "-v, --variadic-option <value:number> <value:string> [value...:boolean]",
    "description ...",
  )
  .action(() => {});

// Optional:

Deno.test("command optionVariadic optional", async () => {
  const { options, args } = await cmd.parse(["-o"]);

  assertEquals(options, { optional: true });
  assertEquals(args, []);
});

// Boolean:

Deno.test("command optionVariadic boolean", async () => {
  const { options, args } = await cmd.parse(["-b", "1", "0", "true", "false"]);

  assertEquals(options, { boolean: [true, false, true, false] });
  assertEquals(args, []);
});

Deno.test("command optionVariadic booleanInvalidValue", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-b", "1", "0", "true", "false", "2"]);
    },
    Error,
    `Option "--boolean" must be of type "boolean", but got "2".`,
  );
});

// String:

Deno.test("command optionVariadic string", async () => {
  const { options, args } = await cmd.parse(["-s", "1", "0", "true", "false"]);

  assertEquals(options, { string: ["1", "0", "true", "false"] });
  assertEquals(args, []);
});

// Number:

Deno.test("command optionVariadic number", async () => {
  const { options, args } = await cmd.parse(["-n", "1", "0", "654", "1.2"]);

  assertEquals(options, { number: [1, 0, 654, 1.2] });
  assertEquals(args, []);
});

Deno.test("command optionVariadic numberInvalidValue", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-n", "1", "0", "654", "abc", "1,2"]);
    },
    Error,
    `Option "--number" must be of type "number", but got "abc".`,
  );
});

// Exact:

Deno.test("command optionVariadic exact", async () => {
  const { options, args } = await cmd.parse(["-v", "1", "abc", "1"]);

  assertEquals(options, { variadicOption: [1, "abc", true] });
  assertEquals(args, []);
});

Deno.test("command optionVariadic exactInvalidValue", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-v", "abc", "abc", "1"]);
    },
    Error,
    `Option "--variadic-option" must be of type "number", but got "abc".`,
  );
});

Deno.test("command optionVariadic exactMissingValue", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-v", "1"]);
    },
    Error,
    `Missing value for option "--variadic-option".`,
  );
});

Deno.test("command optionVariadic exactLastOptional", async () => {
  const { options, args } = await cmd.parse(["-v", "1", "abc"]);

  assertEquals(options, { variadicOption: [1, "abc"] });
  assertEquals(args, []);
});

Deno.test("command optionVariadic exactLastOptionalVariadic", async () => {
  const { options, args } = await cmd.parse(
    ["-v", "1", "abc", "1", "0", "true", "false"],
  );

  assertEquals(
    options,
    // @TODO: fix variadic types.
    // deno-lint-ignore no-explicit-any
    { variadicOption: [1, "abc", true, false, true, false] as any },
  );
  assertEquals(args, []);
});
