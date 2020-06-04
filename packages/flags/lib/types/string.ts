import { IFlagArgument, IFlagOptions, ITypeHandler } from "../types.ts";

export const string: ITypeHandler<string> = (
  option: IFlagOptions,
  arg: IFlagArgument,
  value: string,
): string => {
  return value;
};
