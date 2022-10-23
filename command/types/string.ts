import { string } from "../../flags/types/string.ts";
import { Type } from "../type.ts";
import type { ArgumentValue } from "../types.ts";

/** String type. Allows any value. */
export class StringType<TType extends string> extends Type<TType, string> {
  /** Complete string type. */
  public parse(type: ArgumentValue<TType>): string {
    return string(type);
  }
}
