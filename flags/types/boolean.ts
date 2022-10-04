import type { FlagArgumentTypeInfo } from "../types.ts";
import { InvalidTypeError } from "../_errors.ts";

/** Boolean type handler. Excepts `true`, `false`, `1`, `0` */
export function boolean<TType extends string>(
  type: FlagArgumentTypeInfo<TType>,
): boolean {
  if (~["1", "true"].indexOf(type.value)) {
    return true;
  }

  if (~["0", "false"].indexOf(type.value)) {
    return false;
  }

  throw new InvalidTypeError(type);
}
