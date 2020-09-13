import type { ITypeInfo, ITypeHandler } from "../types.ts";

export const number: ITypeHandler<number> = (
  { label, name, value, type }: ITypeInfo,
): number => {
  if (isNaN(Number(value))) {
    throw new Error(
      `${label} ${name} must be of type ${type} but got: ${value}`,
    );
  }

  return parseFloat(value);
};
