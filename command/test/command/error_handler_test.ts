import {
  assertEquals,
  assertInstanceOf,
  assertRejects,
  assertSpyCalls,
  spy,
} from "../../../dev_deps.ts";
import { Command, ErrorHandler, ValidationError } from "../../mod.ts";

Deno.test("[command] should call error handler on error", async () => {
  let error: unknown;
  const errorHandler = (): ErrorHandler => (error, cmd) => {
    assertInstanceOf(error, ValidationError);
    assertInstanceOf(cmd, Command);
    assertEquals(cmd.getName(), "child");
    assertInstanceOf(error.cmd, Command);
    assertEquals(error.cmd.getName(), "child");
  };
  const errorHandlerSpy = spy(errorHandler());
  const child2ErrorHandlerSpy = spy(errorHandler());

  const cmd = new Command()
    .throwErrors()
    .error(errorHandlerSpy)
    .command("child")
    .action(() => {
      throw new ValidationError("validation error message.");
    })
    .command("child2")
    .error(child2ErrorHandlerSpy)
    .action(() => {
      throw new ValidationError("validation error message.");
    });

  try {
    await cmd.parse(["child"]);
  } catch (err) {
    error = err;
  }

  assertSpyCalls(errorHandlerSpy, 1);
  assertSpyCalls(child2ErrorHandlerSpy, 0);
  assertInstanceOf(error, ValidationError);
  assertInstanceOf(error.cmd, Command);
  assertEquals(error.cmd.getName(), "child");
});

Deno.test("[command] should call child error handler on child error", async () => {
  let error: unknown;
  const errorHandler = (): ErrorHandler => (error, cmd) => {
    assertInstanceOf(error, ValidationError);
    assertInstanceOf(cmd, Command);
    assertEquals(cmd.getName(), "child2");
    assertInstanceOf(error.cmd, Command);
    assertEquals(error.cmd.getName(), "child2");
  };
  const errorHandlerSpy = spy(errorHandler());
  const child2ErrorHandlerSpy = spy(errorHandler());

  const cmd = new Command()
    .throwErrors()
    .error(errorHandlerSpy)
    .command("child")
    .action(() => {
      throw new ValidationError("validation error message.");
    })
    .command("child2")
    .error(child2ErrorHandlerSpy)
    .action(() => {
      throw new ValidationError("validation error message.");
    });

  try {
    await cmd.parse(["child2"]);
  } catch (err) {
    error = err;
  }

  assertSpyCalls(errorHandlerSpy, 0);
  assertSpyCalls(child2ErrorHandlerSpy, 1);
  assertInstanceOf(error, ValidationError);
  assertInstanceOf(error.cmd, Command);
  assertEquals(error.cmd.getName(), "child2");
});

Deno.test("[command] should handle error with useRawArgs enabled", async () => {
  const errorHandlerSpy = spy();

  await assertRejects(
    () =>
      new Command()
        .throwErrors()
        .error(errorHandlerSpy)
        .option("-f, --foo", "...")
        .arguments("[bar:string]")
        .useRawArgs()
        .action(() => {
          throw new Error("foo");
        })
        .parse([
          "-f",
          "test",
        ]),
    Error,
    "foo",
  );

  assertSpyCalls(errorHandlerSpy, 1);
});

Deno.test("[command] should handle error on sub command with useRawArgs enabled", async () => {
  const errorHandlerSpy = spy();

  await assertRejects(
    () =>
      new Command()
        .throwErrors()
        .error(errorHandlerSpy)
        .command("foo")
        .option("-f, --foo", "...")
        .arguments("[bar:string]")
        .useRawArgs()
        .action(() => {
          throw new Error("foo");
        })
        .parse([
          "foo",
          "-f",
          "test",
        ]),
    Error,
    "foo",
  );

  assertSpyCalls(errorHandlerSpy, 1);
});
