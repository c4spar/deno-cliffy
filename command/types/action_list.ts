import type { Command } from "../command.ts";
import { StringType } from "./string.ts";

/** Completion list type. */
export class ActionListType<TType extends string> extends StringType<TType> {
  constructor(protected cmd: Command) {
    super();
  }

  /** Complete action names. */
  public complete(): string[] {
    return this.cmd.getCompletions()
      .map((type) => type.name)
      // filter unique values
      .filter((value, index, self) => self.indexOf(value) === index);
  }
}
