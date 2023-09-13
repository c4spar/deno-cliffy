import { Command, EnumType } from "../../mod.ts";
import {
  assert,
  IsAny,
  IsExact,
} from "https://deno.land/x/conditional_type_checks@1.0.6/mod.ts";

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
    name:
      "[command] - generic types - options and args should be of type any 2",
    fn() {
      // deno-lint-ignore no-explicit-any
      new Command<any>()
        .option("-f, --foo, [val:string]", "...")
        .arguments("<val:string> [val:string]")
        .env("FOO_BAR <val:number>", "")
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
        { bar?: true }
      >()
        .action((options, ...args) => {
          assert<IsExact<typeof args, [bar?: number]>>(true);
          assert<
            IsExact<typeof options, {
              bar?: true;
              foo?: boolean;
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name:
      "[command] - generic types - pre-defined constructor types with options",
    fn() {
      type Arguments = [input: string, output?: string, level?: number];
      type Options = {
        name: string;
        age: number;
        email?: string;
      };
      type GlobalOptions = {
        debug?: true;
        debugLevel: "debug" | "info" | "warn" | "error";
      };

      new Command<void, void, Options, Arguments, GlobalOptions>()
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
              debugLevel: "debug" | "info" | "warn" | "error";
              name: string;
              age: number;
              email?: string;
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
        .select("bar-bar");

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
    fn() {
      const fooCommand = new Command<{ main?: true }>();

      new Command()
        .globalOption("--main", "")
        .command("foo", fooCommand);
    },
  });

  Deno.test({
    name: "[command] - generic types - child command with parent option",
    fn() {
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
    },
  });

  Deno.test({
    name: "[command] - generic types - unkown parent option on empty command",
    fn() {
      new Command()
        // @ts-expect-error unknown global option main
        .command("foo", new Command<{ main?: true }>());
    },
  });

  Deno.test({
    name: "[command] - generic types - unkown parent option",
    fn() {
      new Command()
        .globalOption("--foo", "")
        // @ts-expect-error unknown global option main
        .command("foo", new Command<{ main?: true }>());
    },
  });

  Deno.test({
    name: "[command] - generic types - unkown parent option with sub command",
    fn() {
      new Command()
        .globalOption("--foo", "")
        .command(
          "foo",
          // @ts-expect-error unknown global option main
          new Command<{ main?: true }>()
            .command("foo")
            .option("--bar", ""),
        );
    },
  });

  Deno.test({
    name: "[command] - generic types - global parent option with sub command",
    fn() {
      new Command()
        .globalOption("--foo", "")
        .command(
          "foo",
          new Command<{ foo?: true }>()
            .command("foo")
            .option("--bar", ""),
        );
    },
  });

  Deno.test({
    name: "[command] - generic types - incompatible parent option type",
    fn() {
      const fooCommand = new Command<{ main?: number }>();

      new Command()
        .globalOption("--main", "")
        // @ts-expect-error main option has incompatible type
        .command("foo", fooCommand);
    },
  });

  Deno.test({
    name:
      "[command] - generic types - unkown parent option on command with global option",
    fn() {
      const fooCommand = new Command<{ main2?: true }>();

      new Command()
        .option("-d, --debug", "...", { global: true })
        // @ts-expect-error unknown global option main2
        .command("foo", fooCommand);
    },
  });

  Deno.test({
    name:
      "[command] - generic types - unkown parent option on command with global option 2",
    fn() {
      const fooCommand = new Command<{ main2?: true }>();

      new Command()
        .globalOption("-d, --debug", "...")
        // @ts-expect-error unknown global option main2
        .command("foo", fooCommand);
    },
  });

  Deno.test({
    name: "[command] - generic types - simple extended command",
    fn() {
      class Foo extends Command {}

      new Command().command("foo", new Foo());
    },
  });

  Deno.test({
    name: "[command] - generic types - extended command",
    fn() {
      class Foo
        extends Command<{ main?: true }, void, { foo?: true }, [string]> {}

      new Command()
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
        });
    },
  });

  Deno.test({
    name:
      "[command] - generic types - extended command with incompatible parent option type",
    fn() {
      class Foo extends Command<{ main?: boolean }, void, { foo?: true }, []> {}

      new Command()
        .globalOption("--main", "...")
        // @ts-expect-error boolean is not compatible to true
        .command("foo", new Foo());
    },
  });

  Deno.test({
    name: "[command] - generic types - return types",
    fn() {
      new Command()
        .type("color", new EnumType(["red", "blue"]))
        .option("--num [val:number]", "")
        .option("--str [val:string]", "")
        .option("--bool [val:boolean]", "")
        .option("-c, -C, --color, --color-name [val:color]", "")
        .option("--req <val:string>", "", { required: true })
        .option("-f", "")
        .arguments("<arg1:color> [arg2:string]")
        .action((options, ...args) => {
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
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - just a variadic arg",
    fn() {
      new Command()
        .arguments("<...args:number>")
        .action((options, ...args) => {
          assert<IsExact<typeof args, [number, ...Array<number>]>>(true);
          assert<
            IsExact<typeof options, void>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - many arguments",
    fn() {
      enum Lang {
        JS = "js",
        Rust = "rust",
      }
      const colorType = new EnumType(["red", "blue"]);

      new Command()
        .type("color", colorType)
        .type("lang", new EnumType(Lang))
        .arguments(
          "<arg1> <arg2:string> <arg3:number> <arg4:boolean> [arg5] [arg6:string] [arg7:number] [arg8:boolean] [arg9:color] [...rest:lang[]]",
        )
        .action((options, ...args) => {
          assert<
            IsExact<typeof args, [
              string,
              string,
              number,
              boolean,
              string?,
              string?,
              number?,
              boolean?,
              ("red" | "blue")?,
              ...Array<Array<Lang>>,
            ]>
          >(true);
          assert<IsExact<typeof options, void>>(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - command arguments",
    fn() {
      const colorType = new EnumType(["red", "blue"]);
      const langType = new EnumType(["js", "rust"]);
      new Command()
        .globalType("color", colorType)
        .globalType("lang", langType)
        .command("foo <arg1:string> [arg2:color] [...rest:lang[]]")
        .action((options, ...args) => {
          assert<
            IsExact<typeof args, [
              string,
              ("red" | "blue")?,
              ...Array<Array<"js" | "rust">>,
            ]>
          >(true);

          assert<IsExact<typeof options, void>>(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - command arguments",
    fn() {
      new Command()
        .command("foo <val:number>")
        .action((options, ...args) => {
          assert<IsExact<typeof args, [number]>>(true);
          assert<IsExact<typeof options, void>>(true);
        });
    },
  });

  Deno.test({
    name:
      "[command] - generic types - command arguments with just a variadic argument",
    fn() {
      new Command()
        .command("foo <...val>")
        .action((options, ...args) => {
          assert<IsExact<typeof args, [string, ...Array<string>]>>(true);
          assert<IsExact<typeof options, void>>(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - command arguments with custom types",
    fn() {
      const colorType = new EnumType(["red", "blue"]);
      const langType = new EnumType(["js", "rust"]);
      new Command()
        .globalType("color", colorType)
        .globalType("lang", langType)
        .command("foo <arg1:string> [arg2:color] [...rest:lang[]]")
        .action((options, ...args) => {
          assert<
            IsExact<typeof args, [
              string,
              ("red" | "blue")?,
              ...Array<Array<"js" | "rust">>,
            ]>
          >(true);

          assert<IsExact<typeof options, void>>(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - environment variables",
    fn() {
      const colorType = new EnumType(["red", "blue"]);
      const langType = new EnumType(["js", "rust"]);
      new Command()
        .globalType("color", colorType)
        .globalType("lang", langType)
        .option("--foo-bar <val:color>", "")
        .env("FOO_BAR <val:color>", "")
        .env("FOO_BAR_BAZ=<val:number>", "", { required: true })
        .globalEnv("GLOBAL_FOO_BAR <val:lang>", "")
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              globalFooBar?: "js" | "rust";
              fooBar?: "red" | "blue";
              fooBarBaz: number;
            }>
          >(true);
        })
        .command("foo")
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              globalFooBar?: "js" | "rust";
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - env var prefix",
    fn() {
      new Command()
        .env("FOO_BAR_BAZ=<val:string>", "", { prefix: "FOO_" })
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              barBaz?: string;
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - option with multiple values",
    fn() {
      new Command()
        .option("--foo-bar <val:string> <val:boolean> [val:number]", "")
        .option("--foo-bar-baz=<val:string> [val:number]", "")
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              fooBar?: [string, boolean, number?];
              fooBarBaz?: [string, number?];
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - option with equal sign",
    fn() {
      new Command()
        .option("--foo-bar=<val:string>", "")
        .option("--foo-bar-baz=<val:string> [val:number]", "")
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              fooBar?: string;
              fooBarBaz?: [string, number?];
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - default value",
    fn() {
      const colorType = new EnumType(["red", "blue"]);
      new Command()
        .type("color", colorType)
        .option("--foo [val:string]", "...")
        .option("--bar [val:string]", "...", { default: 4 })
        .option("--baz <val:color>", "...", { default: "red" })
        .option("--beep <val:string> [val:string]", "...", {
          default: new Date(),
          global: true,
        })
        .globalOption("--boop <val:string> [val:number]", "...", {
          default: new Date(),
        })
        .option("--one.two <val:string>", "...", { default: 4 })
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              foo?: string | true;
              bar: string | true | 4;
              baz: "red" | "blue";
              beep: Date | [string, string?];
              boop: Date | [string, number?];
              one: { two: string | 4 };
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - value option",
    fn() {
      new Command()
        .option("--foo [val:string]", "...")
        .option("--bar [val:string]", "...", { default: 4 })
        .option("--baz <val:string>", "...", { default: 4 })
        .option("--beep <val:string> [val:string]", "...", {
          default: new Date(),
          global: true,
          value: (value) => {
            assert<IsExact<typeof value, Date | [string, string?]>>(true);
            return new Map<string, number>();
          },
        })
        .globalOption("--boop <val:string> [val:string]", "...", {
          default: /.*/g,
          required: true,
          collect: true,
          value(value, val: Array<Date> = []) {
            assert<IsExact<typeof value, RegExp | [string, string?]>>(true);
            return [...val, new Date()];
          },
        })
        .option("--one.foo <val:string>", "...", {
          default: 4,
          value: (value) => {
            assert<IsExact<typeof value, string | 4>>(true);
            return new Date();
          },
        })
        .option("--one.bar <val:string>", "...", {
          value: (value) => {
            assert<IsExact<typeof value, string>>(true);
            return /.*/;
          },
        })
        .option("--three.four <val:string>", "...", {
          value: (value) => {
            assert<IsExact<typeof value, string>>(true);
            return 2;
          },
        })
        .env("ENV_VAR=<val:number>", "...", {
          required: true,
          value(value) {
            assert<IsExact<typeof value, number>>(true);
            return new Date();
          },
        })
        .option("--env-var-2 <val:string>", "...", (value) => {
          assert<IsExact<typeof value, string>>(true);
          return new Date();
        })
        .env("ENV_VAR_2=<val:string>", "...", {
          value(value) {
            assert<IsExact<typeof value, string>>(true);
            return new Date();
          },
        })
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              beep: Map<string, number>;
              boop: Array<Date>;
              foo?: string | true;
              bar: string | true | 4;
              baz: string | 4;
              one: { foo: Date; bar?: RegExp };
              three?: { four?: number };
              envVar: Date;
              envVar2?: Date;
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - collect option",
    fn() {
      new Command()
        .option("--beep <val:string>", "...", {
          collect: true,
        })
        .globalOption("--boop <val:integer>", "...", {
          collect: true,
        })
        .option("--beep2 <val:string>", "...", {
          collect: true,
          // deno-lint-ignore no-inferrable-types
          value: (val: string, prev: string = "") => val + prev,
        })
        .globalOption("--boop2 <val:integer>", "...", {
          collect: false,
          // deno-lint-ignore no-inferrable-types
          value: (val: number, prev: number = 1) => val + prev,
          action(options, ...args) {
            assert<IsExact<typeof args, []>>(true);
            assert<
              IsExact<typeof options, {
                beep?: Array<string>;
                boop?: Array<number>;
                beep2?: string;
                boop2?: number;
              }>
            >(true);
          },
        })
        .option(
          "-v, --verbose",
          "Increase debug output.",
          {
            collect: true,
            // deno-lint-ignore no-inferrable-types
            value: (_: number | true, previus: number = 0) => ++previus,
            action(options, ...args) {
              assert<IsExact<typeof args, []>>(true);
              assert<
                IsExact<typeof options, {
                  beep?: Array<string>;
                  boop?: Array<number>;
                  beep2?: string;
                  boop2?: number;
                  verbose?: number;
                }>
              >(true);
            },
          },
        )
        .action((options, ...args) => {
          assert<IsExact<typeof args, []>>(true);
          assert<
            IsExact<typeof options, {
              beep?: Array<string>;
              boop?: Array<number>;
              beep2?: string;
              boop2?: number;
              verbose?: number;
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - negatable option",
    fn() {
      new Command()
        .option("--color <color:string>", "Color name.", { default: "yellow" })
        .option("--no-color", "No color.")
        .option("--no-check", "No check.")
        .option("--remote <url:string>", "Remote url.", { depends: ["color"] })
        .option("--no-remote", "No remote.")
        .option("--no-default-value", "No remote.", { default: 5 })
        .action((options) => {
          assert<
            IsExact<typeof options, {
              color: string | false;
              check: boolean;
              remote?: string | false;
              defaultValue: false | 5;
            }>
          >(true);
        });
    },
  });

  Deno.test({
    name: "[command] - generic types - parse() return value",
    async fn() {
      const { args, cmd, literal, options } = await new Command()
        .throwErrors()
        .option("--foo", "...")
        .option("--bar <value:number>", "...")
        .option("--barbaz <value:number>", "...", {
          value: (value) => new Date(value),
        })
        .arguments("<foo:string> [bar:number]")
        .parse(["abc"]);

      assert<IsExact<typeof args, [string, number?]>>(true);
      assert<
        IsExact<
          typeof cmd,
          Command<
            void,
            void,
            {
              foo?: true;
              bar?: number;
              barbaz?: Date;
            },
            [string, number?],
            void,
            {
              number: number;
              integer: number;
              string: string;
              boolean: boolean;
            },
            void,
            undefined
          >
        >
      >(true);
      assert<IsExact<typeof literal, Array<string>>>(true);
      assert<
        IsExact<typeof options, {
          foo?: true;
          bar?: number;
          barbaz?: Date;
        }>
      >(true);
    },
  });

  Deno.test({
    name:
      "[command] - generic types - parse() return value with child commands",
    async fn() {
      const { args, cmd, literal, options } = await new Command()
        .option("--foo", "...")
        .option("--bar <value:number>", "...")
        .option("--barbaz <value:number>", "...", {
          value: (value) => new Date(value),
        })
        .command("foo", "...")
        .parse(Deno.args);

      assert<IsExact<typeof args, Array<unknown>>>(true);
      assert<
        IsExact<
          typeof cmd,
          Command<
            Record<string, unknown>,
            Record<string, unknown>,
            Record<string, unknown>,
            Array<unknown>,
            Record<string, unknown>,
            Record<string, unknown>,
            Record<string, unknown>,
            undefined
          >
        >
      >(true);
      assert<IsExact<typeof literal, Array<string>>>(true);
      assert<IsExact<typeof options, Record<string, unknown>>>(true);
    },
  });

  Deno.test({
    name: "[command] - generic types - useRawArgs()",
    fn() {
      new Command()
        .option("-f, --foo, [val:string]", "...")
        .arguments("<val:string> [val:string]")
        .useRawArgs()
        .action((options, ...args) => {
          assert<IsExact<typeof options, void>>(true);
          assert<IsExact<typeof args, Array<string>>>(true);
        });
    },
  });
});
