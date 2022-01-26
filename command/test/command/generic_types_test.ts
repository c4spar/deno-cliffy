import { Command } from "../../command.ts";
const { test } = Deno;

test({
  name: "command - generic types - default generics should be of type any",
  fn() {
    // deno-lint-ignore no-explicit-any
    new Command<any>()
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
      // // @ts-expect-error not allowed to add Command<any> to typed commands, must be casted to Command<void> or or a typed command.
      // deno-lint-ignore no-explicit-any
      .command("bar", new Command<any>())
      .command("baz", new Command())
      .action((_options) => {
        // callback fn should be valid also if args is not defined as second parameter.
      });
  },
});

test({
  name: "command - generic types - command with void options and arguments",
  fn() {
    new Command<void, void, void, []>()
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
    new Command<void, void, void, [number]>()
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
    new Command<
      void,
      void,
      { foo?: boolean },
      [bar?: number],
      { bar?: boolean }
    >()
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
    const cmd = new Command<void>()
      .versionOption("-V, --versionx", "")
      .option("--main", "")
      .globalOption("--debug", "", {
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
      .option("--log-level", "", {
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
      .globalOption("--foo-global", "")
      .option("--foo", "")
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
      .globalOption("--bar-global", "")
      .option("--bar", "")
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
    // @TODO:use parent options not global options!
    const foo = new Command<
      void,
      void,
      void,
      [],
      { debug?: boolean; logLevel?: boolean }
    >()
      .globalOption("--foo-global", "")
      .option("--foo", "")
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
      .globalOption("--foo-foo-global", "")
      .option("--foo-foo", "")
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

    // @TODO: use parent options not global options
    const bar = new Command<
      void,
      void,
      void,
      [],
      { debug?: boolean; logLevel?: boolean }
    >()
      .globalOption("--bar-global", "")
      .option("--bar", "")
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

    // deno-lint-ignore no-explicit-any
    const _main: Command<any> = new Command<void>()
      .arguments<[input: string, output: string]>("<input> [output]")
      .globalOption("--debug", "")
      .globalOption("--log-level", "")
      .option("--main", "")
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
  name: "command - generic types - child command with parent option 1",
  async fn() {
    const fooCommand = new Command<{ main?: boolean }>();

    await new Command<void>()
      .globalOption("--main", "")
      .command("foo", fooCommand)
      .parse(Deno.args);
  },
});

test({
  name: "command - generic types - child command with parent option 2",
  async fn() {
    type GlobalOptions = { main?: boolean };

    const foo = new Command<void>()
      .option("-f, --foo", "");

    const cmd = new Command<void>()
      .globalOption<GlobalOptions>("--main", "")
      .action((options) => {
        /** valid */
        options.main;
        /** invalid */
        // @ts-expect-error option foo not exists
        options.foo;
      })
      .command("1", new Command<GlobalOptions>())
      .action((options) => {
        /** valid */
        options.main;
        /** invalid */
        // @ts-expect-error option foo not exists
        options.foo;
      })
      .command("2", new Command<void>())
      .action((options) => {
        /** valid */
        options.main;
        /** invalid */
        // @ts-expect-error option foo not exists
        options.foo;
      })
      .command("3", new Command<GlobalOptions>())
      .action((options) => {
        /** valid */
        options.main;
        /** invalid */
        // @ts-expect-error option foo not exists
        options.foo;
      })
      .command("4", foo)
      .action((options) => {
        /** valid */
        options.main;
        options.foo;
        /** invalid */
        // @ts-expect-error option foo not exists
        options.bar;
      });

    cmd.command("5", new Command<{ main?: boolean }>());

    // @ts-expect-error unknown global option main2
    cmd.command("6", new Command<{ main2?: boolean }>());

    await cmd.parse(Deno.args);
  },
});

test({
  name:
    "command - generic types - child command with invalid parent option type",
  async fn() {
    const fooCommand = new Command<{ main?: number }>();

    await new Command<void>()
      .globalOption("--main", "")
      // @ts-expect-error main option has incompatible type
      .command("foo", fooCommand)
      .parse(Deno.args);
  },
});

test({
  name: "command - generic types - child command with invalid parent option 1",
  async fn() {
    const fooCommand = new Command<{ main2?: boolean }>();

    await new Command<void>()
      .option("-d, --debug", "...", { global: true })
      // @ts-expect-error unknown global option main2
      .command("foo", fooCommand)
      .parse(Deno.args);
  },
});

test({
  name: "command - generic types - child command with invalid parent option 2",
  async fn() {
    const fooCommand = new Command<{ main2?: boolean }>();

    await new Command<void>()
      .globalOption("-d, --debug", "...")
      // @ts-expect-error unknown global option main2
      .command("foo", fooCommand)
      .parse(Deno.args);
  },
});

test({
  name: "command - generic types - child command with invalid parent option 3",
  async fn() {
    const fooCommand = new Command<{ main2?: boolean }>();

    await new Command<void>()
      .option("--main", "")
      // @ts-expect-error unknown global option main2
      .command("foo", fooCommand)
      .parse(Deno.args);
  },
});

test({
  name: "command - generic types - child command with invalid parent option 4",
  async fn() {
    const fooCommand = new Command<{ main2?: boolean }>();

    await new Command<void>()
      .option("--main", "")
      // @ts-expect-error unknown global option main2
      .command("foo", fooCommand)
      .parse(Deno.args);
  },
});

test({
  name: "command - generic types - child command with invalid parent option 5",
  async fn() {
    const fooCommand = new Command<{ main?: boolean }>();

    await new Command<void>()
      .option("--main", "")
      // @ts-expect-error unknown global option main
      .command("foo", fooCommand)
      .parse(Deno.args);
  },
});

test({
  name: "command - generic types - child command with invalid parent option 6",
  async fn() {
    await new Command<void>()
      // @ts-expect-error unknown global option main
      .command("foo", new Command<{ main?: boolean }>())
      .parse(Deno.args);
  },
});

test({
  name: "command - generic types - constructor types",
  fn() {
    type Arguments = [input: string, output?: string, level?: number];
    interface Options {
      name: string;
      age: number;
      email?: string;
    }
    interface GlobalOptions {
      debug?: boolean;
      debugLevel: "debug" | "info" | "warn" | "error";
    }

    new Command<
      void,
      void,
      Options,
      Arguments,
      GlobalOptions
    >()
      .arguments("<input:string> [output:string] [level:number]")
      .globalOption("-d, --debug", "description ...")
      .globalOption("-l, --debug-level <string>", "description ...", {
        default: "warn",
      })
      .option("-n, --name <name:string>", "description ...", { required: true })
      .option("-a, --age <age:number>", "description ...", { required: true })
      .option("-e, --email <email:string>", "description ...")
      .action((options, input, output?, level?) => {
        /** valid options */
        options.name && options.age && options.email;
        options.debug && options.debugLevel;
        if (level) {
          isNaN(level);
        }
        /** invalid options */
        // @ts-expect-error option foo does not exist.
        options.foo;
        // @ts-expect-error argument of type string is not assignable to parameter of type number
        isNaN(input);
        // @ts-expect-error argument of type string | undefined is not assignable to parameter of type number
        isNaN(output);
        // @ts-expect-error argument of type number | undefined is not assignable to parameter of type number
        isNaN(level);
      });
  },
});

test({
  name: "command - generic types - extended command",
  async fn() {
    class Foo extends Command {}

    await new Command()
      .command("foo", new Foo())
      .parse(Deno.args);
  },
});

// test({
//   name: "command - generic types - extended command 2",
//   async fn() {
//     class Foo extends Command {}

//     await new Command<void>()
//     .command("foo", new Foo())
//     .parse(Deno.args);
//   },
// });
