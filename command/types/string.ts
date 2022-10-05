import { string } from "../../flags/types/string.ts";
import { Type } from "../type.ts";
import type { TypeInfo } from "../types.ts";

/** String type. Allows any value. */
export class StringType<TType extends string> extends Type<TType, string> {
  /** Complete string type. */
  public parse(type: TypeInfo<TType>): string {
    return string(type);
  }
}
