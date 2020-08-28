import { ITypeInfo, ITypeHandler } from "../types.ts";

export const boolean: ITypeHandler<boolean> = (
  { label, name, value, type }: ITypeInfo,
): boolean => {
  if (~["1", "true"].indexOf(value)) {
    return true;
  }

  if (~["0", "false"].indexOf(value)) {
    return false;
  }

  throw new Error(`${label} ${name} must be of type ${type} but got: ${value}`);
};
