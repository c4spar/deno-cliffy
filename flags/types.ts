/**
 * Available build-in argument types.
 * @deprecated Deprecated in favor of `FlagArgumentType`.
 * @see FlagArgumentType
 */
export enum OptionType {
  STRING = "string",
  NUMBER = "number",
  INTEGER = "integer",
  BOOLEAN = "boolean",
}

export type FlagArgumentType = "string" | "boolean" | "number" | "integer";

// /** Parser options. */
export interface ParseFlagsOptions<
  TType extends string = FlagArgumentType,
  TFlagOptions extends FlagOptions<TType> = FlagOptions<TType>,
> {
  flags?: Array<TFlagOptions>;
  option?: (option: TFlagOptions, value?: unknown) => void;
  stopEarly?: boolean;
  stopOnUnknown?: boolean;
  allowEmpty?: boolean;
  ignoreDefaults?: Record<string, unknown>;
  dotted?: boolean;
}

export interface BaseFlagOptions {
  name: string;
  aliases?: string[];
  standalone?: boolean;
  default?: FlagDefaultValue;
  required?: boolean;
  depends?: string[];
  conflicts?: string[];
  value?: FlagValueHandler;
  collect?: boolean;
  equalsSign?: boolean;
}

export interface SingleValueFlagOptions<TType extends string>
  extends BaseFlagOptions, BaseFlagArgument<TType> {
  optionalValue?: boolean;
  args?: never;
}

export interface MultiValueFlagOptions<TType extends string>
  extends BaseFlagOptions {
  type?: never;
  args: Array<FlagArgument<TType>>;
}

export type FlagOptions<TType extends string> =
  | SingleValueFlagOptions<TType>
  | MultiValueFlagOptions<TType>;

/** Result of the parseFlags method. */
export type ParseFlagsContext<
  TType extends string,
  TFlags extends Record<string, unknown>,
  TStandaloneOption extends FlagOptions<TType>,
> = {
  flags: TFlags;
  unknown: Array<string>;
  literal: Array<string>;
  standalone?: TStandaloneOption;
  stopEarly: boolean;
  stopOnUnknown: boolean;
};

export interface BaseFlagArgument<TType extends string> {
  type?: TType;
  variadic?: boolean;
  list?: boolean;
  separator?: string;
}

export interface FlagArgument<TType extends string>
  extends BaseFlagArgument<TType> {
  type: TType;
  optional?: boolean;
}

/** Default flag value */
export type FlagDefaultValue<TValue = unknown> = TValue | (() => TValue);

/** Value handler for custom value processing. */
// deno-lint-ignore no-explicit-any
export type FlagValueHandler<TValue = any, TPrevious = TValue> = (
  val: TValue,
  previous?: TPrevious,
) => TPrevious;

/** Type details. */
export interface FlagArgumentTypeInfo<TType extends string = FlagArgumentType> {
  label: string;
  type: TType;
  name: string;
  value: string;
}

/** Custom type handler/parser. */
export type FlagArgumentTypeHandler<
  TType extends string,
  TReturn,
> = (
  type: FlagArgumentTypeInfo<TType>,
) => TReturn;
