import { Command } from "../command.ts";
import { dim, italic } from "../deps.ts";
import { FishCompletionsGenerator } from "./fish-completions-generator.ts";

/**
 * Generate fish completion script.
 */
export class FishCompletionsCommand extends Command {
  public constructor(cmd?: Command) {
    super();
    this.description(() => {
      cmd = cmd || this.getMainCommand();
      return `Generate shell completions for fish.

  ${dim(italic(`${cmd.getPath()} completions fish > ${cmd.getPath()}.fish`))}
  ${dim(italic(`source ${cmd.getPath()}.fish`))}`;
    })
      .action(() => {
        Deno.stdout.writeSync(new TextEncoder().encode(
          FishCompletionsGenerator.generate(cmd || this.getMainCommand()),
        ));
      });
  }
}
