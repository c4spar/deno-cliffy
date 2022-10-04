import type { FlagArgumentTypeInfo } from "../types.ts";
import { InvalidTypeError } from "../_errors.ts";

/** Number type handler. Excepts any numeric value. */
export function number<TType extends string>(
  type: FlagArgumentTypeInfo<TType>,
): number {
  const value = Number(type.value);
  if (Number.isFinite(value)) {
    return value;
  }

  throw new InvalidTypeError(type);
}
