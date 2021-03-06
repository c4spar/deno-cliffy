import { Command } from "../../command.ts";
const { test } = Deno;

test({
  name: "command - generic types - default generics should be of type any",
  fn() {
    new Command()
      .action((options, ...args) => {
        options = 1;
        args = 1;
        args[0] = 1;
        args.length = 1;
        args.foo = 1;
        options.foo = 1;
        options.bar = 1;
        options.baz = 1;
      });
  },
});

test({
  name: "command - generic types - command with void options",
  fn() {
    new Command<void>()
      .action((options, ...args) => {
        args.length;
        // @ts-expect-error option foo does not exists
        args[0] = 1;
        // @ts-expect-error args is an array
        args.foo;
        // @ts-expect-error option foo does not exists
        options.foo;
        // @ts-expect-error expression of type void cannot be tested for truthiness
        if (options) {
          // @ts-expect-error option foo does not exists
          options.foo;
        }
      })
      .command("foo", new Command<void>())
      .action((_options) => {
        // callback fn should be valid also if args is not defined as second parameter.
      })
      // @ts-expect-error not allowed to add Command<any> to typed commands, must be casted to Command<void> or or a typed command.
      .command("bar", new Command())
      .command("baz", new Command() as Command<void>)
      .action((_options) => {
        // callback fn should be valid also if args is not defined as second parameter.
      });
  },
});

test({
  name: "command - generic types - command with void options and arguments",
  fn() {
    new Command<void, []>()
      .action((options, ...args) => {
        args.length;
        // @ts-expect-error index 0 is undefined
        args[0] = 1;
        // @ts-expect-error args is an array
        args.foo;
        // @ts-expect-error option foo does not exists
        options.foo;
      });
  },
});

test({
  name:
    "command - generic types - command with void options and predefined arguments",
  fn() {
    new Command<void, [number]>()
      .action((options, ...args) => {
        args[0] = 1;
        args.length;
        // @ts-expect-error option foo does not exists
        options.foo;
      });
  },
});

test({
  name:
    "command - generic types - command with predefined options and arguments",
  fn() {
    new Command<{ foo?: boolean }, [bar?: number], { bar?: boolean }>()
      .action((options, ...args) => {
        options.foo;
        options.bar;
        args[0] = 1;
        // @ts-expect-error string is not assignable to number
        args[0] = "1";
        // @ts-expect-error index 1 does not exist
        args[1] = 1;
        // @ts-expect-error number is not assignable to options
        options = 1;
        // @ts-expect-error option baz does not exists
        options.baz;
      });
  },
});

test({
  name: "command - generic types - chained command with generics",
  fn() {
    const cmd = new Command<void, []>()
      .versionOption("-V, --versionx", "")
      .option<{ main: boolean }>("--main", "")
      .globalOption<{ debug: boolean }>("--debug", "", {
        action: (options) => {
          /** valid */
          options.debug &&
            options.main;
          /** invalid */
          // @ts-expect-error option not exists
          options.logLevel &&
            // @ts-expect-error option logLevel is defined after debug
            options.foo && options.fooGlobal &&
            // @ts-expect-error option not exists
            options.bar && options.barGlobal;
        },
      })
      .option<{ logLevel: boolean }>("--log-level", "", {
        global: true,
        action: (options) => {
          /** valid */
          options.debug && options.logLevel &&
            options.main;
          /** invalid */
          // @ts-expect-error option not exists
          options.foo && options.fooGlobal &&
            // @ts-expect-error option not exists
            options.bar && options.barGlobal;
        },
      })
      .action((options) => {
        /** valid */
        options.debug && options.logLevel &&
          options.main;
        /** invalid */
        // @ts-expect-error option not exists
        options.foo && options.fooGlobal &&
          // @ts-expect-error option not exists
          options.bar && options.barGlobal;
      });

    cmd.command("foo")
      .globalOption<{ fooGlobal?: boolean }>("--foo-global", "")
      .option<{ foo?: boolean }>("--foo", "")
      .action((options) => {
        /** valid */
        options.debug && options.logLevel &&
          options.foo && options.fooGlobal;
        /** invalid */
        // @ts-expect-error option not exists
        options.main &&
          // @ts-expect-error option not exists
          options.bar && options.barGlobal;
      });

    cmd.command("bar")
      .globalOption<{ barGlobal?: boolean }>("--bar-global", "")
      .option<{ bar?: boolean }>("--bar", "")
      .action((options) => {
        /** valid */
        options.debug && options.logLevel &&
          options.bar && options.barGlobal;
        /** invalid */
        // @ts-expect-error option not exists
        options.main &&
          // @ts-expect-error option not exists
          options.foo && options.fooGlobal;
      });
  },
});

test({
  name: "command - generic types - splitted command with generics",
  fn() {
    const foo = new Command<
      void,
      [],
      { debug?: boolean; logLevel?: boolean }
    >()
      .globalOption<{ fooGlobal?: boolean }>("--foo-global", "")
      .option<{ foo?: boolean }>("--foo", "")
      .action((options) => {
        /** valid */
        options.debug && options.logLevel &&
          options.foo && options.fooGlobal;
        /** invalid */
        // @ts-expect-error option not exists
        options.main &&
          // @ts-expect-error option not exists
          options.bar && options.barGlobal &&
          // @ts-expect-error option not exists
          options.fooFoo && options.fooFooGlobal;
      })
      .command("bar-bar")
      .command("foo-foo")
      .globalOption<{ fooFooGlobal?: boolean }>("--foo-foo-global", "")
      .option<{ fooFoo?: boolean }>("--foo-foo", "")
      .action((options) => {
        /** valid */
        options.debug && options.logLevel &&
          options.fooGlobal &&
          options.fooFoo && options.fooFooGlobal;
        /** invalid */
        // @ts-expect-error option not exists
        options.main &&
          // @ts-expect-error option not exists
          options.foo &&
          // @ts-expect-error option not exists
          options.bar && options.barGlobal;
      })
      .select("bar-bar")
      .reset();

    const bar = new Command<void, [], { debug: boolean; logLevel: boolean }>()
      .globalOption<{ barGlobal?: boolean }>("--bar-global", "")
      .option<{ bar: boolean }>("--bar", "")
      .versionOption("--versionx", "", {
        global: true,
        action(options) {
          /** valid */
          options.debug && options.logLevel &&
            options.bar && options.barGlobal;
          /** invalid */
          // @ts-expect-error option not exists
          options.main &&
            // @ts-expect-error option not exists
            options.foo && options.fooGlobal &&
            // @ts-expect-error option not exists
            options.fooFoo && options.fooFooGlobal;
        },
      })
      .action((options) => {
        /** valid */
        options.debug && options.logLevel &&
          options.bar && options.barGlobal;
        /** invalid */
        // @ts-expect-error option not exists
        options.main &&
          // @ts-expect-error option not exists
          options.foo && options.fooGlobal &&
          // @ts-expect-error option not exists
          options.fooFoo && options.fooFooGlobal;
      });

    const _main: Command = new Command<void, []>()
      .arguments<[input: string, output: string]>("<input> [output]")
      .globalOption<{ debug?: boolean }>("--debug", "")
      .globalOption<{ logLevel?: boolean }>("--log-level", "")
      .option<{ main?: boolean }>("--main", "")
      .action((options, ..._args: [input: string, output: string]) => {
        /** valid */
        options.debug && options.logLevel &&
          options.main;
        /** invalid */
        // @ts-expect-error option not exists
        options.foo && options.fooGlobal &&
          // @ts-expect-error option not exists
          options.bar && options.barGlobal &&
          // @ts-expect-error option not exists
          options.fooFoo && options.fooFooGlobal;
      })
      .command("foo", foo)
      .action((options) => {
        /** valid */
        options.debug && options.logLevel &&
          options.foo && options.fooGlobal;
        /** invalid */
        // @ts-expect-error option not exists
        options.main &&
          // @ts-expect-error option not exists
          options.bar && options.barGlobal &&
          // @ts-expect-error option not exists
          options.fooFoo && options.fooFooGlobal;
      })
      .command("bar", bar)
      .action((options) => {
        /** valid */
        options.debug && options.logLevel &&
          options.bar && options.barGlobal;
        /** invalid */
        // @ts-expect-error option not exists
        options.main &&
          // @ts-expect-error option not exists
          options.foo && options.fooGlobal &&
          // @ts-expect-error option not exists
          options.fooFoo && options.fooFooGlobal;
      });
  },
});

test({
  name:
    "command - generic types - child command with invalid parent option type",
  async fn() {
    const fooCommand = new Command<void, [], void, { main?: number }>();

    await new Command<void>()
      .globalOption<{ main?: boolean }>("--main", "")
      // @ts-expect-error main option has incompatible type
      .command("foo", fooCommand)
      .parse(Deno.args);
  },
});

test({
  name: "command - generic types - child command with invalid parent option 1",
  async fn() {
    const fooCommand = new Command<void, [], void, { main2?: boolean }>();

    await new Command<void>()
      .option<{ main?: boolean }>("-d, --debug", "...", { global: true })
      // @ts-expect-error unknown global option main2
      .command("foo", fooCommand)
      .parse(Deno.args);
  },
});

test({
  name: "command - generic types - child command with invalid parent option 2",
  async fn() {
    const fooCommand = new Command<void, [], void, { main2?: boolean }>();

    await new Command<void>()
      .globalOption<{ main?: boolean }>("-d, --debug", "...")
      // @ts-expect-error unknown global option main2
      .command("foo", fooCommand)
      .parse(Deno.args);
  },
});

// @TODO: unknown global options doesn't emit an type checking error.
// test({
//   name: "command - generic types - child command with invalid parent option 3",
//   async fn() {
//     const fooCommand = new Command<void, [], void, { main2?: boolean }>();

//     await new Command<void>()
//       .option<{ main?: boolean }>("--main", "")
//       // @ts-expect-error unknown global option main2
//       .command("foo", fooCommand)
//       .parse(Deno.args);
//   },
// });

// test({
//   name: "command - generic types - child command with invalid parent option 4",
//   async fn() {
//     const fooCommand = new Command<void, [], void, { main2?: boolean }>();

//     await new Command<void>()
//       .option<{ main?: boolean }>("--main", "")
//       // @ts-expect-error unknown global option main2
//       .command("foo", fooCommand)
//       .parse(Deno.args);
//   },
// });

// test({
//   name: "command - generic types - child command with invalid parent option 5",
//   async fn() {
//     await new Command<void>()
//       // @ts-expect-error unknown global option main
//       .command("foo", new Command<void, [], void, { main?: boolean }>())
//       .parse(Deno.args);
//   },
// });
