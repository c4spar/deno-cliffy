import type { ITypeHandler, ITypeInfo } from "../types.ts";
import { ValidationError } from "../_errors.ts";

/** Boolean type handler. Excepts `true`, `false`, `1`, `0` */
export const boolean: ITypeHandler<boolean> = (
  { label, name, value, type }: ITypeInfo,
): boolean => {
  if (~["1", "true"].indexOf(value)) {
    return true;
  }

  if (~["0", "false"].indexOf(value)) {
    return false;
  }

  throw new ValidationError(
    `${label} "${name}" must be of type "${type}", but got "${value}".`,
  );
};
