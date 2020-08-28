import { Command } from "../command.ts";
import { StringType } from "./string.ts";

export class CommandType extends StringType {
  public complete(cmd: Command, parent?: Command): string[] {
    return parent?.getCommands(false)
      .map((cmd: Command) => cmd.getName()) || [];
  }
}
