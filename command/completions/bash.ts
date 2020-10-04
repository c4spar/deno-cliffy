import { Command } from "../command.ts";
import { dim, italic } from "../deps.ts";
import { BashCompletionsGenerator } from "./_bash_completions_generator.ts";

/**
 * Generates bash completion code.
 */
export class BashCompletionsCommand extends Command {
  public constructor(cmd?: Command) {
    super();
    this.description(() => {
      cmd = cmd || this.getMainCommand();
      return `Generate shell completions for bash.

To enable bash completions for this program add following line to your ${
        dim(italic("~/.bashrc"))
      }:

    ${dim(italic(`source <(${cmd.getPath()} completions bash)`))}`;
    })
      .action(() => {
        Deno.stdout.writeSync(new TextEncoder().encode(
          BashCompletionsGenerator.generate(cmd || this.getMainCommand()),
        ));
      });
  }
}
