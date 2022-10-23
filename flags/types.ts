/** Options for the `parseFlags` method. */
export interface ParseFlagsOptions<
  TType extends string = ArgumentType,
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

/** Base flag options. */
export interface BaseFlagOptions<TDefault = unknown> {
  name: string;
  aliases?: string[];
  standalone?: boolean;
  default?: DefaultValue<TDefault>;
  required?: boolean;
  depends?: string[];
  conflicts?: string[];
  value?: ValueHandler;
  collect?: boolean;
  equalsSign?: boolean;
}

/** Options for a flag with no arguments. */
export type BooleanFlagOptions = BaseFlagOptions;

/** Options for a flag with an argument. */
export interface ValueFlagOptions<TType extends string>
  extends BaseFlagOptions, ArgumentOptions<TType> {
  optionalValue?: boolean;
}

/**
 * Options for a flag with multiple arguments. Arguments are defined with the
 * `args` array. Each argument can have it's own type specified with the `type`
 * option.
 */
export interface ValuesFlagOptions<TType extends string>
  extends BaseFlagOptions {
  args: Array<ArgumentOptions<TType>>;
}

/** Flag options. */
export type FlagOptions<TType extends string> =
  | BooleanFlagOptions
  | ValueFlagOptions<TType>
  | ValuesFlagOptions<TType>;

/** Options for a flag argument. */
export interface ArgumentOptions<TType extends string> {
  type: TType;
  optional?: boolean;
  variadic?: boolean;
  list?: boolean;
  separator?: string;
}
/** Available build-in argument types. */
export type ArgumentType = "string" | "boolean" | "number" | "integer";

/** Default flag value or a method that returns the default value. */
export type DefaultValue<TValue = unknown> =
  | TValue
  | DefaultValueHandler<TValue>;

export type DefaultValueHandler<TValue = unknown> = () => TValue;

/** A callback method for custom processing or mapping of flag values. */
// deno-lint-ignore no-explicit-any
export type ValueHandler<TValue = any, TReturn = TValue> = (
  val: TValue,
  previous?: TReturn,
) => TReturn;

/**
 * Parse result. The parse context will be returned by the `parseFlags` method
 * and can be also passed as first argument to the `parseFlags` method.
 */
export type ParseFlagsContext<
  TType extends string = string,
  // deno-lint-ignore no-explicit-any
  TFlags extends Record<string, any> = Record<string, any>,
  TStandaloneOption extends FlagOptions<TType> = FlagOptions<TType>,
> = {
  flags: TFlags;
  unknown: Array<string>;
  literal: Array<string>;
  standalone?: TStandaloneOption;
  stopEarly: boolean;
  stopOnUnknown: boolean;
};

/** Argument parsing informations. */
export interface ArgumentValue<TType extends string = ArgumentType> {
  label: string;
  type: TType;
  name: string;
  value: string;
}

/**
 * Parse method for custom types. Gets the raw user input passed as argument
 * and returns the parsed value.
 */
export type TypeHandler<
  TType extends string,
  TReturn = unknown,
> = (
  arg: ArgumentValue<TType>,
) => TReturn;
