import {
  Command,
  CompletionsCommand,
  HelpCommand,
  ValidationError,
} from "../../mod.ts";
import { EnumType } from "../../types/enum.ts";

const cmd = new Command()
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
          foo bar baz.
  `,
  )
  .option("-c, --color=<val:color>", "Color option.")
  .option("-C, --colors <val...:color>", "Color option.")
  .arguments("<color:color> [path...:file]")
  .default("help")
  // foo
  .command(
    "foo",
    new Command()
      .description("Foo command.")
      .option("-f, --foo", "Foo option.")
      // bar
      .command("bar", "Bar command.")
      .option("-b, --bar", "Bar option.")
      .reset(),
  )
  .command("bar")
  .option("-f, --file <path>", "...", { required: true })
  .command("validation-error")
  .action(() => {
    throw new ValidationError("Validation error message.", { exitCode: 1 });
  })
  .command("help", new HelpCommand().global())
  .command("completions", new CompletionsCommand());

if (import.meta.main) {
  await cmd.parse();
}
