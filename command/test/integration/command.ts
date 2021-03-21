import { Command, CompletionsCommand } from "../../mod.ts";

await new Command()
  .name("completions-test")
  .description("Completions test.")
  .globalOption("-g, --global <val:boolean>", "Foo option.")
  .option("-m, --main <val:boolean>", "Bar option.")
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
  .command("completions", new CompletionsCommand())
  .parse();
