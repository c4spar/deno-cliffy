import {
  ArgumentValue,
  DefaultValue,
  FlagArgument,
  FlagOptions,
  FlagValueHandler,
  ParseFlagsContext,
  ParseFlagsOptions,
  TypeHandler,
} from "./types.ts";

/** @deprecated Use ParseFlagsOptions instead. */
export type IParseOptions<TFlagOptions extends FlagOptions = FlagOptions> =
  ParseFlagsOptions<TFlagOptions>;

/** @deprecated Use FlagOptions instead. */
export type IFlagOptions = FlagOptions;

/** @deprecated Use FlagArgument instead. */
export type IFlagArgument = FlagArgument;

/** @deprecated Use DefaultValue instead. */
export type IDefaultValue<TValue = unknown> = DefaultValue<TValue>;

/** @deprecated Use FlagValueHandler instead. */
// deno-lint-ignore no-explicit-any
export type IFlagValueHandler<TValue = any, TReturn = TValue> =
  FlagValueHandler<TValue, TReturn>;

/** @deprecated Use ParseFlagsContext instead. */
export type IFlagsResult<
  // deno-lint-ignore no-explicit-any
  TFlags extends Record<string, any> = Record<string, any>,
  TStandaloneOption extends FlagOptions = FlagOptions,
> = ParseFlagsContext<TFlags, TStandaloneOption>;

/** @deprecated Use ArgumentValue instead. */
export type ITypeInfo = ArgumentValue;

/** @deprecated Use TypeHandler instead. */
export type ITypeHandler<TReturn = unknown> = TypeHandler<TReturn>;
