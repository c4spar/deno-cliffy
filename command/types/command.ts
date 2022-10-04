import type { Command } from "../command.ts";
import { StringType } from "./string.ts";

/** String type with auto completion of sibling command names. */
export class CommandType<TType extends string> extends StringType<TType> {
  /** Complete sub-command names of global parent command. */
  public complete(_cmd: Command, parent?: Command): string[] {
    return parent?.getCommands(false)
      .map((cmd: Command) => cmd.getName()) || [];
  }
}
