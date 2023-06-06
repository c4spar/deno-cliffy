import {
  assertEquals,
  assertSpyCall,
  assertSpyCalls,
  assertType,
  IsExact,
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

  const barCmd = new Command<{ main?: true; foo?: true }>()
    .globalOption("--bar", "...")
    .option("--baz", "...")
    .arguments("<foo> <bar>")
    .globalAction((opts, ...args) => {
      assertType<
        IsExact<typeof opts, {
          main?: true;
          foo?: true;
          bar?: true;
          baz?: true;
        }>
      >(true);
      assertType<IsExact<typeof args, Array<unknown>>>(true);
      barGlobalSpy(opts, ...args);
    })
    .action(barSpy);

  const fooCmd = new Command<{ main?: true }>()
    .globalOption("--foo", "...")
    .globalAction((opts, ...args) => {
      assertType<
        IsExact<typeof opts, {
          main?: true;
          foo?: true;
        }>
      >(true);
      assertType<IsExact<typeof args, Array<unknown>>>(true);
      fooGlobalSpy(opts, ...args);
    })
    .action(fooSpy)
    .command("bar", barCmd);

  const cmd = new Command()
    .throwErrors()
    .globalOption("--main", "...")
    .option("--test", "...")
    .globalAction((opts, ...args) => {
      assertType<
        IsExact<typeof opts, {
          main?: true;
          test?: true;
        }>
      >(true);
      assertType<IsExact<typeof args, Array<unknown>>>(true);
      mainGlobalSpy(opts, ...args);
    })
    .action((opts, ...args) => {
      mainSpy(opts, ...args);
      assertType<
        IsExact<typeof opts, {
          main?: true;
          test?: true;
        }>
      >(true);
    })
    .command("foo", fooCmd)
    .command("other", "desc...")
    .action((opts) => {
      assertType<
        IsExact<typeof opts, {
          main?: true;
        }>
      >(true);
    });

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

Deno.test("[flags] should not call global action handler with noGlobals", async () => {
  const globalSpy = spy();
  const baseSpy = spy();
  const fooGlobalSpy = spy();
  const fooBaseSpy = spy();

  const cmd = new Command()
    .throwErrors()
    .option("--main", "...")
    .globalAction(globalSpy)
    .action(baseSpy)
    .command("foo", "...")
    .option("--main", "...")
    .globalAction(fooGlobalSpy)
    .action(fooBaseSpy)
    .noGlobals();

  const args = [{ main: true }];

  await cmd.parse(["foo", "--main"]);

  assertSpyCalls(globalSpy, 0);
  assertSpyCalls(baseSpy, 0);
  assertSpyCalls(fooGlobalSpy, 1);
  assertSpyCalls(fooBaseSpy, 1);
  assertSpyCall(fooGlobalSpy, 0, { args });
  assertSpyCall(fooBaseSpy, 0, { args });
});
