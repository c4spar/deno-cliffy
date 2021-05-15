import { Type } from "../type.ts";
import type { ITypeInfo } from "../types.ts";
import { InvalidTypeError } from "../../flags/_errors.ts";

/** Enum type. Allows only provided values. */
export class EnumType<T extends string | number> extends Type<T> {
  private readonly allowedValues: ReadonlyArray<T>;

  constructor(values: ReadonlyArray<T>) {
    super();
    this.allowedValues = values;
  }

  public parse(type: ITypeInfo): T {
    for (const value of this.allowedValues) {
      if (value.toString() === type.value) {
        return value;
      }
    }

    throw new InvalidTypeError(type, this.allowedValues.slice());
  }

  public complete(): string[] {
    return this.values.slice();
  }
}

export type TypeValue<T extends Type<unknown>> = T extends Type<infer V> ? V
  : never;
