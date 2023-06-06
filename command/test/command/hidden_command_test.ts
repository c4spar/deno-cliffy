import { assertEquals, stripColor } from "../../../dev_deps.ts";
import { CompletionsCommand } from "../../completions/completions_command.ts";
import { HelpCommand } from "../../help/help_command.ts";
import { Command } from "../../command.ts";

function command() {
  return new Command()
    .throwErrors()
    .version("1.0.0")
    .description("Test description ...")
    .help({
      types: true,
      hints: true,
    })
    .command("help", new HelpCommand())
    .command("completions", new CompletionsCommand())
    .command("hidden-command <input:string> <output:string>")
    .hidden();
}

Deno.test("hidden command", async () => {
  // deno-lint-ignore no-explicit-any
  const cmd: Command<any> = command();
  const { options, args } = await cmd.parse(
    ["hidden-command", "input-path", "output-path"],
  );

  assertEquals(options, {});
  assertEquals(args[0], "input-path");
  assertEquals(args[1], "output-path");
});

Deno.test("hidden command help", () => {
  const cmd = command();
  const output: string = cmd.getHelp();

  assertEquals(
    stripColor(output),
    `
Usage:   COMMAND
Version: 1.0.0  

Description:

  Test description ...

Options:

  -h, --help     - Show this help.                            
  -V, --version  - Show the version number for this program.  

Commands:

  help         [command:command]  - Show this help or the help of a sub-command.
  completions                     - Generate shell completions.                 
`,
  );
});
