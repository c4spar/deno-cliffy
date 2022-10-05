import { Type } from "../type.ts";
import type { TypeInfo } from "../types.ts";
import { integer } from "../../flags/types/integer.ts";

/** Integer type. */
export class IntegerType<TType extends string> extends Type<TType, number> {
  /** Parse integer type. */
  public parse(type: TypeInfo<TType>): number {
    return integer(type);
  }
}
