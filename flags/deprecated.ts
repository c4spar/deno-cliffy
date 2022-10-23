// deno-lint-ignore-file no-explicit-any

import type {
  ArgumentOptions,
  ArgumentType,
  ArgumentValue,
  DefaultValue,
  FlagOptions,
  ParseFlagsContext,
  ParseFlagsOptions,
  TypeHandler,
  ValueHandler,
} from "./types.ts";

/** @deprecated Use `ParseFlagsOptions` instead. */
export type IParseOptions<
  TType extends string = ArgumentType,
  TFlagOptions extends FlagOptions<TType> = FlagOptions<TType>,
> = ParseFlagsOptions<TType, TFlagOptions>;

/** @deprecated Use `FlagOptions` instead. */
export type IFlagOptions<TType extends string> = FlagOptions<TType>;

/** @deprecated Use `ArgumentOptions` instead. */
export type IFlagArgument<TType extends string> = ArgumentOptions<TType>;

/** @deprecated Use `DefaultValue` instead. */
export type IDefaultValue<TValue = unknown> = DefaultValue<TValue>;

/** @deprecated Use `ValueHandler` instead. */
export type IFlagValueHandler<TValue = any, TReturn = TValue> = ValueHandler<
  TValue,
  TReturn
>;

/** @deprecated Use `ParseFlagsContext` instead. */
export type IFlagsResult<
  TType extends string = string,
  TFlags extends Record<string, unknown> = Record<string, unknown>,
  TStandaloneOption extends FlagOptions<TType> = FlagOptions<TType>,
> = ParseFlagsContext<TType, TFlags, TStandaloneOption>;

/** @deprecated Use `ArgumentValue` instead. */
export type ITypeInfo = ArgumentValue;

/** @deprecated Use `TypeHandler` instead. */
export type ITypeHandler<
  TType extends string,
  TReturn,
> = TypeHandler<TType, TReturn>;

/** @deprecated Use `ArgumentType` instead. */
export enum OptionType {
  STRING = "string",
  NUMBER = "number",
  INTEGER = "integer",
  BOOLEAN = "boolean",
}
