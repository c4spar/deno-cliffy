import type { FlagArgumentTypeInfo } from "../types.ts";

/** String type handler. Excepts any value. */
export function string<TType extends string>(
  { value }: FlagArgumentTypeInfo<TType>,
): string {
  return value;
}
