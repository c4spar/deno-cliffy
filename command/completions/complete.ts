import { Command } from "../command.ts";
import type { ICompletion } from "../types.ts";

/** Execute auto completion method of command and action. */
export class CompleteCommand extends Command {
  public constructor(cmd?: Command) {
    super();
    this.description("Get completions for given action from given command.")
      .arguments("<action:string> [command...:string]")
      .action(
        async (
          _,
          action: string,
          commandNames: string[],
        ) => {
          let parent: Command | undefined;
          const completeCommand: Command = commandNames
            .reduce((cmd: Command, name: string): Command => {
              parent = cmd;
              const childCmd: Command | undefined = cmd.getCommand(name, false);
              if (!childCmd) {
                throw new Error(
                  `Auto-completion failed. Command not found: ${
                    commandNames.join(" ")
                  }`,
                );
              }
              return childCmd;
            }, cmd || this.getMainCommand());

          const completion: ICompletion | undefined = completeCommand
            .getCompletion(action);
          const result: string[] =
            await completion?.complete(completeCommand, parent) ?? [];

          if (result?.length) {
            Deno.stdout.writeSync(new TextEncoder().encode(result.join("\n")));
          }
        },
      )
      .reset();
  }
}
