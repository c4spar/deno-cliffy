import { Command } from "../command.ts";
import { dim, italic } from "../deps.ts";

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
        throw new Error("Bash completions not supported at this moment.");
      });
  }
}
