import { boolean } from "../../flags/types/boolean.ts";
import type { FlagArgumentTypeInfo } from "../types.ts";
import { Type } from "../type.ts";

/** Boolean type with auto completion. Allows `true`, `false`, `0` and `1`. */
export class BooleanType<TType extends string> extends Type<TType, boolean> {
  /** Parse boolean type. */
  public parse(type: FlagArgumentTypeInfo<TType>): boolean {
    return boolean(type);
  }

  /** Complete boolean type. */
  public complete(): string[] {
    return ["true", "false"];
  }
}
