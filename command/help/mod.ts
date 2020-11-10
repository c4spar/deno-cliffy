import { Command } from "../command.ts";
import { CommandType } from "../types/command.ts";

/** Generates well formatted and colored help output for specified command. */
export class HelpCommand extends Command {
  public constructor(cmd?: Command) {
    super();
    this.type("command", new CommandType())
      .arguments("[command:command]")
      .description("Show this help or the help of a sub-command.")
      .action((_, name?: string) => {
        if (!cmd) {
          cmd = name
            ? this.getGlobalParent()?.getBaseCommand(name)
            : this.getGlobalParent();
        }
        if (!cmd) {
          throw new Error(
            `Failed to generate help for command '${name}'. Command not found.`,
          );
        }
        cmd.help();
        Deno.exit(0);
      });
  }
}
