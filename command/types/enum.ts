import { Type } from "../type.ts";
import type { FlagArgumentTypeInfo } from "../types.ts";
import { InvalidTypeError } from "../../flags/_errors.ts";

/** Enum type. Allows only provided values. */
export class EnumType<
  TType extends string,
  TReturn extends string | number | boolean,
> extends Type<TType, TReturn> {
  private readonly allowedValues: ReadonlyArray<TReturn>;

  constructor(values: ReadonlyArray<TReturn> | Record<string, TReturn>) {
    super();
    this.allowedValues = Array.isArray(values) ? values : Object.values(values);
  }

  public parse(type: FlagArgumentTypeInfo<TType>): TReturn {
    for (const value of this.allowedValues) {
      if (value.toString() === type.value) {
        return value;
      }
    }

    throw new InvalidTypeError(type, this.allowedValues.slice());
  }

  public override values(): Array<TReturn> {
    return this.allowedValues.slice();
  }

  public override complete(): Array<TReturn> {
    return this.values();
  }
}
