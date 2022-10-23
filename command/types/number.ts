import { number } from "../../flags/types/number.ts";
import { Type } from "../type.ts";
import type { ArgumentValue } from "../types.ts";

/** Number type. */
export class NumberType<TType extends string> extends Type<TType, number> {
  /** Parse number type. */
  public parse(type: ArgumentValue<TType>): number {
    return number(type);
  }
}
