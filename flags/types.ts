/** Parser options. */
export interface ParseFlagsOptions<
  TFlagOptions extends FlagOptions = FlagOptions,
> {
  flags?: Array<TFlagOptions>;
  parse?: TypeHandler<unknown>;
  option?: (option: TFlagOptions, value?: unknown) => void;
  stopEarly?: boolean;
  stopOnUnknown?: boolean;
  allowEmpty?: boolean;
  ignoreDefaults?: Record<string, unknown>;
  dotted?: boolean;
}

/** Flag options. */
export interface FlagOptions extends Omit<ArgumentOptions, "optional"> {
  name: string;
  args?: Array<ArgumentOptions>;
  optionalValue?: boolean;
  aliases?: string[];
  standalone?: boolean;
  default?: DefaultValue;
  required?: boolean;
  depends?: string[];
  conflicts?: string[];
  value?: ValueHandler;
  collect?: boolean;
  equalsSign?: boolean;
}

/** Options for a flag argument. */
export interface ArgumentOptions {
  type?: ArgumentType | string;
  optional?: boolean;
  variadic?: boolean;
  list?: boolean;
  separator?: string;
}

/** Available build-in argument types. */
export type ArgumentType = "string" | "boolean" | "number" | "integer";

/** Default flag value or a callback method that returns the default value. */
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
export interface ParseFlagsContext<
  // deno-lint-ignore no-explicit-any
  TFlags extends Record<string, any> = Record<string, any>,
  TStandaloneOption extends FlagOptions = FlagOptions,
> {
  flags: TFlags;
  unknown: Array<string>;
  literal: Array<string>;
  standalone?: TStandaloneOption;
  stopEarly: boolean;
  stopOnUnknown: boolean;
  defaults: Record<string, boolean>;
}

/** Argument parsing informations. */
export interface ArgumentValue {
  label: string;
  type: ArgumentType | string;
  name: string;
  value: string;
}

/**
 * Parse method for custom types. Gets the raw user input passed as argument
 * and returns the parsed value.
 */
export type TypeHandler<TReturn = unknown> = (arg: ArgumentValue) => TReturn;
