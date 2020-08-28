import { Command } from "../command.ts";
import { dim, italic } from "../deps.ts";
import { ZshCompletionsGenerator } from "./zsh-completions-generator.ts";

/**
 * Generates zsh completion code.
 */
export class ZshCompletionsCommand extends Command {
  public constructor(cmd?: Command) {
    super();
    this.description(() => {
      cmd = cmd || this.getMainCommand();
      return `Generate shell completions for zsh.

To enable zsh completions for this program add following line to your ${
        dim(italic("~/.zshrc"))
      }:

    ${dim(italic(`source <(${cmd.getPath()} completions zsh)`))}`;
    })
      .action(() => {
        Deno.stdout.writeSync(new TextEncoder().encode(
          ZshCompletionsGenerator.generate(cmd || this.getMainCommand()),
        ));
      });
  }
}
