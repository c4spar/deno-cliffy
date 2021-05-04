import { Type } from "../type.ts";
import type { ITypeInfo } from "../types.ts";
import { InvalidTypeError } from "../../flags/_errors.ts";

/** Enum type. Allows only provided values. */
export class EnumType<T extends string> extends Type<T> {
  constructor(
    private readonly values: ReadonlyArray<T>,
  ) {
    super();
  }

  public parse(type: ITypeInfo): T {
    if (!this.values.includes(type.value as T)) {
      throw new InvalidTypeError(type, this.values.slice());
    }

    return type.value as T;
  }

  public complete(): string[] {
    return this.values.slice();
  }
}

export type TypeValue<T extends Type<unknown>> = T extends Type<infer V> ? V
  : never;
