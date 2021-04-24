import type { ITypeHandler, ITypeInfo } from "../types.ts";
import { InvalidTypeError } from "../_errors.ts";

/** Number type handler. Excepts any numeric value. */
export const number: ITypeHandler<number> = (type: ITypeInfo): number => {
  if (!isNaN(Number(type.value))) {
    return parseFloat(type.value);
  }

  throw new InvalidTypeError(type);
};
