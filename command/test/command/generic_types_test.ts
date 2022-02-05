import { Command, EnumType } from "../../mod.ts";
import {
  assert,
  IsAny,
  IsExact,
} from "https://deno.land/x/conditional_type_checks@1.0.5/mod.ts";

// Not required to execute this code, only type check.
(() => {
  Deno.test({
    name: "[command] - generic types - options and args should be of type any",
    fn() {
      // deno-lint-ignore no-explicit-any
      new Command<any>()
        .action((options, ...args) => {
          assert<IsAny<typeof options>>(true);
          assert<IsAny<typeof args>>(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - command with void options",
    fn() {
      new Command()
        .action((options, ...args) => {
          assert<IsExact<typeof options, void>>(true);
          assert<IsExact<typeof args, []>>(true);
        })
        .command("foo", new Command())
        .action((options, ...args) => {
          assert<IsExact<typeof options, void>>(true);
          assert<IsExact<typeof args, []>>(true);
        })
        .command("bar", new Command<void>())
        .action((options, ...args) => {
          assert<IsExact<typeof options, void>>(true);
          assert<IsExact<typeof args, []>>(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - command with void options and arguments",
    fn() {
      new Command<void, void, void, []>()
        .action((options, ...args) => {
          assert<IsExact<typeof options, void>>(true);
          assert<IsExact<typeof args, []>>(true);
        });
    },
  });

  Deno.test({
    name:
      "[command] - generic types - command with void options and predefined arguments",
    fn() {
      new Command<void, void, void, [number]>()
        .action((options, ...args) => {
          assert<IsExact<typeof options, void>>(true);
          assert<IsExact<typeof args, [number]>>(true);
        });
    },
  });

  Deno.test({
    name:
      "[command] - generic types - command with predefined options and arguments",
    fn() {
      new Command<
        void,
        void,
        { foo?: boolean },
        [bar?: number],
        { bar?: boolean }
      >()
        .action((options, ...args) => {
          assert<IsExact<typeof args, [bar?: number]>>(true);
          assert<
            IsExact<typeof options, {
              bar?: boolean;
              foo?: boolean;
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - chained command",
    fn() {
      const cmd = new Command()
        .versionOption("-V, --versionx", "")
        .option("--main", "")
        .globalOption("--debug", "", {
          action: (options, ...args) => {
            assert<IsExact<typeof args, []>>(true);
            assert<
              IsExact<typeof options, {
                debug?: true;
                // logLevel?: true;
                main?: true;
              }>
            >(true);
          },
        })
        .option("--log-level", "", {
          global: true,
          action: (options, ...args) => {
            assert<IsExact<typeof args, []>>(true);
            assert<
              IsExact<typeof options, {
                debug?: true;
                logLevel?: true;
                main?: true;
              }>
            >(true);
          },
        })
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              debug?: true;
              logLevel?: true;
              main?: true;
            }>
          >(true);
        });

      cmd.command("foo")
        .globalOption("--foo-global", "")
        .option("--foo", "")
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              debug?: true;
              logLevel?: true;
              fooGlobal?: true;
              foo?: true;
            }>
          >(true);
        });

      cmd.command("bar")
        .globalOption("--bar-global", "")
        .option("--bar", "")
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              debug?: true;
              logLevel?: true;
              barGlobal?: true;
              bar?: true;
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - add child commands",
    fn() {
      const foo = new Command<{ debug?: true; logLevel?: true }>()
        .globalOption("--foo-global", "")
        .option("--foo", "")
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              debug?: true;
              logLevel?: true;
              fooGlobal?: true;
              foo?: true;
            }>
          >(true);
        })
        .command("bar-bar")
        .command("foo-foo")
        .globalOption("--foo-foo-global", "")
        .option("--foo-foo", "")
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              debug?: true;
              logLevel?: true;
              fooGlobal?: true;
              fooFooGlobal?: true;
              fooFoo?: true;
            }>
          >(true);
        })
        .select("bar-bar")
        .reset();

      const bar = new Command<{ debug?: true; logLevel?: true }>()
        .globalOption("--bar-global", "")
        .option("--bar", "")
        .versionOption("--versionx", "", {
          global: true,
          action(options, ...args) {
            assert<IsExact<typeof args, []>>(true);
            assert<
              IsExact<typeof options, {
                debug?: true;
                logLevel?: true;
                barGlobal?: true;
                bar?: true;
              }>
            >(true);
          },
        })
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              debug?: true;
              logLevel?: true;
              barGlobal?: true;
              bar?: true;
            }>
          >(true);
        });

      // deno-lint-ignore no-explicit-any
      const _main: Command<any> = new Command()
        .arguments("<input> [output:number]")
        .globalOption("--debug", "")
        .globalOption("--log-level", "")
        .option("--main", "")
        .action((options, ...args) => {
          assert<IsExact<typeof args, [string, number?]>>(true);
          assert<
            IsExact<typeof options, {
              debug?: true;
              logLevel?: true;
              main?: true;
            }>
          >(true);
        })
        .command("foo", foo)
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              debug?: true;
              logLevel?: true;
              fooGlobal?: true;
              foo?: true;
            }>
          >(true);
        })
        .command("bar", bar)
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              debug?: true;
              logLevel?: true;
              barGlobal?: true;
              bar?: true;
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - simple child command with parent option",
    async fn() {
      const fooCommand = new Command<{ main?: true }>();

      await new Command()
        .globalOption("--main", "")
        .command("foo", fooCommand)
        .parse(Deno.args);
    },
  });

  Deno.test({
    name: "[command] - generic types - child command with parent option",
    async fn() {
      const foo = new Command()
        .option("-f, --foo", "");

      const cmd = new Command()
        .globalOption("--main", "")
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              main?: true;
            }>
          >(true);
        })
        .command("1", new Command())
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              main?: true;
            }>
          >(true);
        })
        .command("2", foo)
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              main?: true;
              foo?: true;
            }>
          >(true);
        })
        .command("3", new Command())
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              main?: true;
            }>
          >(true);
        })
        .command("4", new Command<{ main?: true }>());

      // @ts-expect-error unknown global option main2
      cmd.command("5", new Command<{ main2?: true }>());

      await cmd.parse(Deno.args);
    },
  });

  Deno.test({
    name: "[command] - generic types - unkown parent option",
    async fn() {
      await new Command()
        // @ts-expect-error unknown global option main
        .command("foo", new Command<{ main?: true }>())
        .parse(Deno.args);
    },
  });

  Deno.test({
    name: "[command] - generic types - incompatible parent option type",
    async fn() {
      const fooCommand = new Command<{ main?: number }>();

      await new Command()
        .globalOption("--main", "")
        // @ts-expect-error main option has incompatible type
        .command("foo", fooCommand)
        .parse(Deno.args);
    },
  });

  Deno.test({
    name:
      "[command] - generic types - unkown parent option on command with global option",
    async fn() {
      const fooCommand = new Command<{ main2?: true }>();

      await new Command()
        .option("-d, --debug", "...", { global: true })
        // @ts-expect-error unknown global option main2
        .command("foo", fooCommand)
        .parse(Deno.args);
    },
  });

  Deno.test({
    name:
      "[command] - generic types - unkown parent option on command with global option 2",
    async fn() {
      const fooCommand = new Command<{ main2?: true }>();

      await new Command()
        .globalOption("-d, --debug", "...")
        // @ts-expect-error unknown global option main2
        .command("foo", fooCommand)
        .parse(Deno.args);
    },
  });

  Deno.test({
    name: "[command] - generic types - pre-defined constructor types",
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
        .option("-n, --name <name:string>", "description ...", {
          required: true,
        })
        .option("-a, --age <age:number>", "description ...", { required: true })
        .option("-e, --email <email:string>", "description ...")
        .action((options, ...args) => {
          assert<IsExact<typeof args, [string, string?, number?]>>(true);
          assert<
            IsExact<typeof options, {
              debug?: true;
              debugLevel?: string;
              name: string;
              age: number;
              email?: string;
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - simple extended command",
    async fn() {
      class Foo extends Command {}

      await new Command()
        .command("foo", new Foo())
        .parse(Deno.args);
    },
  });

  Deno.test({
    name: "[command] - generic types - extended command",
    async fn() {
      class Foo
        extends Command<{ main?: true }, void, { foo?: true }, [string]> {}

      await new Command()
        .globalOption("--main", "...")
        .command("foo", new Foo())
        .action((options, ...args) => {
          assert<IsExact<typeof args, [string]>>(true);
          assert<
            IsExact<typeof options, {
              main?: true;
              foo?: true;
            }>
          >(true);
        })
        .parse(Deno.args);
    },
  });

  Deno.test({
    name:
      "[command] - generic types - extended command with incompatible parent option type",
    async fn() {
      class Foo extends Command<{ main?: boolean }, void, { foo?: true }, []> {}

      await new Command()
        .globalOption("--main", "...")
        // @ts-expect-error boolean is not compatible to true
        .command("foo", new Foo())
        .parse(Deno.args);
    },
  });

  Deno.test({
    name: "[command] - generic types - return types",
    async fn() {
      const { args, options } = await new Command()
        .type("color", new EnumType(["red", "blue"]))
        .option("--num [val:number]", "")
        .option("--str [val:string]", "")
        .option("--bool [val:boolean]", "")
        .option("-c, -C, --color, --color-name [val:color]", "")
        .option("--req <val:string>", "", { required: true })
        .option("-f", "")
        .arguments("<arg1:color> [arg2:string]")
        .parse(Deno.args);

      assert<IsExact<typeof args, ["red" | "blue", string?]>>(true);

      assert<
        IsExact<typeof options, {
          color?: true | "red" | "blue";
          num?: number | true;
          str?: string | true;
          bool?: boolean;
          req: string;
          f?: true;
        }>
      >(true);
    },
  });

  Deno.test({
    name: "[command] - generic types - many arguments",
    async fn() {
      const { args, options } = await new Command()
        .type("color", new EnumType(["red", "blue"]))
        .type("lang", new EnumType(["js", "rust"]))
        .arguments(
          "<arg1> <arg2:string> <arg3:number> <arg4:boolean> [arg5] [arg6:string] [arg7:number] [arg8:boolean] [arg9:color] [...rest:lang[]]",
        )
        .parse(Deno.args);

      assert<
        IsExact<
          typeof args,
          [
            string,
            string,
            number,
            boolean,
            string?,
            string?,
            number?,
            boolean?,
            ("red" | "blue")?,
            Array<Array<"js" | "rust">>?,
          ]
        >
      >(true);

      assert<IsExact<typeof options, void>>(true);
    },
  });

  Deno.test({
    name: "[command] - generic types - command arguments",
    async fn() {
      await new Command()
        .globalType("color", new EnumType(["red", "blue"]))
        .globalType("lang", new EnumType(["js", "rust"]))
        .command("foo <arg1:string> [arg2:color] [...rest:lang[]]")
        .action((options, ...args) => {
          assert<
            IsExact<
              typeof args,
              [
                string,
                ("red" | "blue")?,
                Array<Array<"js" | "rust">>?,
              ]
            >
          >(true);

          assert<IsExact<typeof options, void>>(true);
        })
        .parse(Deno.args);
    },
  });
});
