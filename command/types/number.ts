import { number } from "../../flags/types/number.ts";
import { Type } from "../type.ts";
import { ITypeInfo } from "../types.ts";

export class NumberType extends Type<number> {
  public parse(type: ITypeInfo): number {
    return number(type);
  }
}
