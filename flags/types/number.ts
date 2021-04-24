import type { ITypeHandler, ITypeInfo } from "../types.ts";
import { ValidationError } from "../_errors.ts";

/** Number type handler. Excepts any numeric value. */
export const number: ITypeHandler<number> = (
  { label, name, value, type }: ITypeInfo,
): number => {
  if (isNaN(Number(value))) {
    throw new ValidationError(
      `${label} "${name}" must be of type "${type}", but got "${value}".`,
    );
  }

  return parseFloat(value);
};
