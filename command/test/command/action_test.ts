import {
  assertEquals,
  assertSpyCall,
  assertSpyCalls,
  spy,
} from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

interface IStats {
  // deno-lint-ignore no-explicit-any
  context: null | Command<any>;
  options: unknown;
  args: unknown;
}

function createStats(): IStats {
  return {
    context: null,
    options: null,
    args: null,
  };
}

Deno.test("flags allowEmpty enabled", async () => {
  const stats: IStats = createStats();

  const cmd = new Command()
    .throwErrors()
    .arguments("[beep:string]")
    .option("-f, --foo [value:string]", "description ...")
    .action(function (options, ...args) {
      stats.context = this;
      stats.options = options;
      stats.args = args;
    });

  const { options, args } = await cmd.parse(["--foo", "bar", "beep"]);

  assertEquals(stats.context, cmd);
  assertEquals(stats.options, { foo: "bar" });
  assertEquals(stats.args, ["beep"]);
  assertEquals(stats.options, options);
  assertEquals(stats.args, args);
});

Deno.test("flags allowEmpty enabled", async () => {
  const stats: IStats = createStats();
  // deno-lint-ignore no-explicit-any
  let subCmd: Command<any>;

  const cmd = new Command()
    .throwErrors()
    .command(
      "foo",
      subCmd = new Command()
        .arguments("[beep:string]")
        .option("-b, --bar [value:string]", "description ...")
        .action(function (options, ...args) {
          stats.context = this;
          stats.options = options;
          stats.args = args;
        }),
    );

  const { options, args } = await cmd.parse(["foo", "--bar", "baz", "beep"]);

  assertEquals(stats.context, subCmd);
  assertEquals(stats.options, { bar: "baz" });
  assertEquals(stats.args, ["beep"]);
  assertEquals(stats.options, options);
  assertEquals(stats.args, args);
});

Deno.test("[flags] should call global action handler", async () => {
  const mainGlobalSpy = spy();
  const mainSpy = spy();
  const fooGlobalSpy = spy();
  const fooSpy = spy();
  const barGlobalSpy = spy();
  const barSpy = spy();

  const barCmd = new Command()
    .globalOption("--bar", "...")
    .option("--baz", "...")
    .arguments("<foo> <bar>")
    .globalAction(barGlobalSpy)
    .action(barSpy);

  const fooCmd = new Command()
    .globalOption("--foo", "...")
    .globalAction(fooGlobalSpy)
    .action(fooSpy)
    .command("bar", barCmd);

  const cmd = new Command()
    .throwErrors()
    .globalOption("--main", "...")
    .globalAction(mainGlobalSpy)
    .action(mainSpy)
    .command("foo", fooCmd);

  await cmd.parse([
    "--main",
    "foo",
    "--foo",
    "bar",
    "--bar",
    "--baz",
    "beep",
    "boop",
  ]);

  assertSpyCalls(mainGlobalSpy, 1);
  assertSpyCalls(mainSpy, 0);
  assertSpyCalls(fooGlobalSpy, 1);
  assertSpyCalls(fooSpy, 0);
  assertSpyCalls(barGlobalSpy, 1);
  assertSpyCalls(barSpy, 1);

  const args = [
    {
      bar: true,
      baz: true,
      foo: true,
      main: true,
    },
    "beep",
    "boop",
  ];

  assertSpyCall(mainGlobalSpy, 0, { args });
  assertSpyCall(fooGlobalSpy, 0, { args });
  assertSpyCall(barGlobalSpy, 0, { args });
  assertSpyCall(barSpy, 0, { args });
});

Deno.test("[flags] should call global and base action handler", async () => {
  const globalSpy = spy();
  const baseSpy = spy();

  const cmd = new Command()
    .throwErrors()
    .globalOption("--main", "...")
    .globalAction(globalSpy)
    .action(baseSpy);

  await cmd.parse(["--main"]);

  assertSpyCalls(globalSpy, 1);
  assertSpyCalls(baseSpy, 1);

  const args = [{ main: true }];

  assertSpyCall(globalSpy, 0, { args });
  assertSpyCall(baseSpy, 0, { args });
});
