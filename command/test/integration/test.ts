import { snapshotTest } from "../../../testing/snapshot.ts";
import {
  Command,
  CompletionsCommand,
  EnumType,
  HelpCommand,
  ValidationError,
} from "../../mod.ts";

await snapshotTest({
  name: "command integration",
  meta: import.meta,
  ignore: Deno.build.os === "windows",
  colors: true,
  steps: {
    "should complete boolean arg": {
      args: ["completions", "complete", "boolean"],
    },
    "should complete boolean arg from foo command": {
      args: ["completions", "complete", "boolean", "foo"],
    },
    "should complete boolean arg from foo bar command": {
      args: ["completions", "complete", "boolean", "foo", "bar"],
    },
    "should complete available commands for help command": {
      args: ["completions", "complete", "command", "help"],
    },
    "should complete enum": { args: ["completions", "complete", "color"] },
    "should generate bash completions": { args: ["completions", "bash"] },
    "should override name in bash completions": {
      args: ["completions", "bash", "--name", "foo-command"],
    },
    "should generate fish completions": { args: ["completions", "fish"] },
    "should override name in fish completions": {
      args: ["completions", "fish", "--name", "foo-command"],
    },
    "should generate zsh completions": { args: ["completions", "zsh"] },
    "should override name in zsh completions": {
      args: ["completions", "zsh", "--name", "foo-command"],
    },
    "should output command help with help command": { args: ["help"] },
    "should output sub-command help with help command": {
      args: ["help", "foo"],
    },
    "should output short help with -h flag": { args: ["-h"] },
    "should output long help with --help flag": { args: ["--help"] },
    "should output short version with -V flag": { args: ["-V"] },
    "should output long version with --version flag": { args: ["--version"] },
    "should print the help of sub-command on validation error": {
      args: ["bar"],
      canFail: true,
    },
    "should print error message for unknown option with suggestion": {
      args: ["--colorr"],
      canFail: true,
    },
    "should print help and error message when validation error": {
      args: ["validation-error"],
      canFail: true,
    },
  },
  async fn() {
    await new Command()
      .version("1.0.0")
      .name("completions-test")
      .description(`
        Completions test.
        
          Completions test.
        Completions test.
      `)
      .meta("meta1", "value1")
      .meta("meta2", "value2")
      .meta("meta3", "value3")
      .globalType("color", new EnumType(["blue", "yellow", "red"]))
      .globalOption("-g, --global <val:boolean>", "Foo option.")
      .option(
        "-m, --main <val:boolean>",
        `
        Bar option.
          foo bar baz. foo bar baz.
        
        foo bar baz.
        foo bar baz.`,
      )
      .option(
        "--color=<val:color>",
        "Color option with \"'quotes'\" and ([{brackets}]) \n and line breaks.",
      )
      .option("-C, --colors <val...:color>", "Color option.")
      .arguments("<color:color> [path...:file]")
      .default("help")
      // foo
      .command(
        "foo",
        new Command()
          .description(
            "Foo command with \"'quotes'\" and ([{brackets}]) \n and line breaks.",
          )
          .option("-f, --foo", "Foo option.")
          // bar
          .command("bar", "Bar command.")
          .option("-b, --bar", "Bar option.")
          .reset(),
      )
      .command("bar")
      .command("foo:bar")
      .option("-f, --file <path>", "...", { required: true })
      .command("validation-error")
      .action(() => {
        throw new ValidationError("Validation error message.", { exitCode: 1 });
      })
      .command("help", new HelpCommand().global())
      .command("completions", new CompletionsCommand())
      .parse();
  },
});
