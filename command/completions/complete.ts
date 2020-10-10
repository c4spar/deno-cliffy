import { Command } from "../command.ts";
import type { ICompletion } from "../types.ts";

/**
 * Execute complete method for specific action and command.
 */
export class CompleteCommand extends Command {
  public constructor(cmd?: Command) {
    super();
    this.description("Get completions for given action from given command.")
      .arguments("<action:string> [command...:string]")
      .option("-l, --list", "Use line break as value separator.")
      .action(
        async (
          { list }: { list?: boolean },
          // deno-lint-ignore no-undef
          action: string,
          // deno-lint-ignore no-undef
          commandNames: string[],
        ) => {
          let parent: Command | undefined;
          // deno-lint-ignore no-undef
          const completeCommand: Command = commandNames
            .reduce((cmd: Command, name: string): Command => {
              parent = cmd;
              const childCmd: Command | undefined = cmd.getCommand(name, false);
              if (!childCmd) {
                throw new Error(
                  `Auto-completion failed. Command not found: ${
                    // deno-lint-ignore no-undef
                    commandNames.join(" ")
                  }`,
                );
              }
              return childCmd;
            }, cmd || this.getMainCommand());

          const completion: ICompletion | undefined = completeCommand
            // deno-lint-ignore no-undef
            .getCompletion(action);
          const result: string[] =
            await completion?.complete(completeCommand, parent) ?? [];

          if (result?.length) {
            Deno.stdout.writeSync(new TextEncoder().encode(result.join(
              list ? "\n" : " ",
            )));
          }
        },
      )
      .reset();
  }
}
