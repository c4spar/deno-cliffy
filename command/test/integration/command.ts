import { Command, CompletionsCommand, HelpCommand } from "../../mod.ts";
import { EnumType } from "../../types/enum.ts";

const cmd = new Command()
  .version("1.0.0")
  .name("completions-test")
  .description("Completions test.")
  .globalType("color", new EnumType(["blue", "yellow", "red"]))
  .globalOption("-g, --global <val:boolean>", "Foo option.")
  .option("-m, --main <val:boolean>", "Bar option.")
  .option("-c, --color <val:color>", "Color option.")
  .default("help")
  // foo
  .command(
    "foo",
    new Command()
      .description("Foo command.")
      .option("-f, --foo", "Foo option.")
      // bar
      .command("bar", "Bar command.")
      .option("-b, --bar", "Bar option."),
  )
  .command("help", new HelpCommand().global())
  .command("completions", new CompletionsCommand());

if (import.meta.main) {
  await cmd.parse();
}
