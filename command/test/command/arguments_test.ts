import {
  assertEquals,
  assertRejects,
  describe,
  it,
} from "../../../dev_deps.ts";
import type { ArgumentValue } from "../../../flags/types.ts";
import { ValidationError } from "../../_errors.ts";
import { Command } from "../../command.ts";

function cmd() {
  return new Command()
    .throwErrors()
    .type("color", ({ label, name, type, value }: ArgumentValue) => {
      if (!["red", "blue", "yellow"].includes(value)) {
        throw new ValidationError(
          `${label} "${name}" must be a valid "${type}", but got "${value}".`,
        );
      }
      return value;
    })
    .option("-f, --foo <foo> <bar> <baz>", "...")
    .arguments(
      "<foo:string> [bar:number] [baz:boolean] [color:color] [list:number[]]",
    );
}

function cmd2() {
  return new Command()
    .throwErrors()
    .command(
      "foo <foo:string> [bar:number] [baz:boolean] [color:color] [list:number[]]",
    )
    .type("color", ({ label, name, type, value }: ArgumentValue) => {
      if (!["red", "blue", "yellow"].includes(value)) {
        throw new Error(
          `${label} "${name}" must be a valid "${type}", but got "${value}".`,
        );
      }
      return value;
    })
    .option("-f, --foo <foo> <bar> <baz>", "...");
}

describe("command arguments", () => {
  it("should accept a dash as argument", async () => {
    const { args } = await new Command()
      .arguments("<input:string>")
      .parse(["-"]);
    assertEquals(args, ["-"]);
  });

  it("should parse correctly argument types", async () => {
    const { args } = await cmd().parse([
      "abc",
      "123",
      "true",
      "red",
      "1,2,3,4",
    ]);
    assertEquals(args, ["abc", 123, true, "red", [1, 2, 3, 4]]);
  });

  it("should parse correctly an isolated variadic argument", async () => {
    const { args } = await new Command()
      .throwErrors()
      .arguments("<...foo:string>")
      .parse(["foo", "bar", "baz"]);

    assertEquals(args, ["foo", "bar", "baz"]);
  });

  it("should parse correctly argument types with sub command arguments", async () => {
    const { args } = await cmd2().parse([
      "foo",
      "abc",
      "123",
      "true",
      "red",
      "1,2,3,4",
    ]);
    assertEquals(args, ["abc", 123, true, "red", [1, 2, 3, 4]]);
  });

  it("should not throw for missing optional values", async () => {
    const { args } = await cmd().parse(["abc", "0"]);
    assertEquals(args, ["abc", 0]);
  });

  it("should parse multi argument option", async () => {
    const { options, args } = await cmd().parse([
      "-f",
      "1",
      "2",
      "3",
      "mod.ts",
    ]);
    assertEquals(options, { foo: ["1", "2", "3"] });
    assertEquals(args, ["mod.ts"]);
  });

  it("should throw an error for invalid number types", async () => {
    await assertRejects(
      async () => {
        await cmd().parse(["abc", "xyz", "true", "red"]);
      },
      ValidationError,
      `Argument "bar" must be of type "number", but got "xyz".`,
    );
  });

  it("should throw an error for invalid list types", async () => {
    await assertRejects(
      async () => {
        await cmd().parse(["abc", "123", "true", "red", "1,2,3,four"]);
      },
      ValidationError,
      `Argument "list" must be of type "number", but got "four".`,
    );
  });

  it("should throw an error for invalid list types with sub command arguments", async () => {
    await assertRejects(
      async () => {
        await cmd2().parse(["foo", "abc", "123", "true", "red", "1,2,3,four"]);
      },
      ValidationError,
      `Argument "list" must be of type "number", but got "four".`,
    );
  });

  it("should throw an error for missing required arguments", async () => {
    await assertRejects(
      async () => {
        await cmd().parse([]);
      },
      ValidationError,
      "Missing argument(s): foo",
    );
  });

  it("should throw an error for invalid boolean types", async () => {
    await assertRejects(
      async () => {
        await cmd().parse(["abc", "123", "xyz", "red"]);
      },
      ValidationError,
      `Argument "baz" must be of type "boolean", but got "xyz".`,
    );
  });

  it("should throw an error for invalid custom type value", async () => {
    await assertRejects(
      async () => {
        await cmd().parse(["abc", "123", "true", "xyz"]);
      },
      ValidationError,
      `Argument "color" must be a valid "color", but got "xyz".`,
    );
  });

  it("should throw to many arguments error for global & none global option before a sub-command", async () => {
    await assertRejects(
      async () => {
        await new Command()
          .noExit()
          .globalOption("--foo", "foo...")
          .option("--bar", "...")
          .command("foo", "...")
          .parse(["--foo", "--bar", "foo"]);
      },
      ValidationError,
      `Too many arguments: foo`,
    );
  });
});
