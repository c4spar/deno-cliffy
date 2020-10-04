import type { ITypeHandler, ITypeInfo } from "../types.ts";

export const string: ITypeHandler<string> = ({ value }: ITypeInfo): string => {
  return value;
};
