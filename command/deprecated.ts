import { Type } from "./type.ts";

/** @deprecated Use `Type.infer` instead. */
export type TypeValue<TType, TDefault = TType> = Type.infer<TType, TDefault>;
