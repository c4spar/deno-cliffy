import { Type } from "../type.ts";
import type { ArgumentValue } from "../types.ts";
import { integer } from "../../flags/types/integer.ts";

/** Integer type. */
export class IntegerType<TType extends string> extends Type<TType, number> {
  /** Parse integer type. */
  public parse(type: ArgumentValue<TType>): number {
    return integer(type);
  }
}
