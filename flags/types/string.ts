import type { ArgumentValue } from "../types.ts";

/** String type handler. Excepts any value. */
export function string<TType extends string>(
  { value }: ArgumentValue<TType>,
): string {
  return value;
}
