/** Parser options. */
export interface ParseFlagsOptions<T extends FlagOptions = FlagOptions> {
  flags?: Array<T>;
  parse?: TypeHandler<unknown>;
  option?: (option: T, value?: unknown) => void;
  stopEarly?: boolean;
  stopOnUnknown?: boolean;
  allowEmpty?: boolean;
  ignoreDefaults?: Record<string, unknown>;
  dotted?: boolean;
}

/** Flag options. */
export interface FlagOptions extends FlagArgument {
  name: string;
  args?: FlagArgument[];
  aliases?: string[];
  standalone?: boolean;
  default?: DefaultValue;
  required?: boolean;
  depends?: string[];
  conflicts?: string[];
  value?: FlagValueHandler;
  collect?: boolean;
  equalsSign?: boolean;
}

/** Flag argument definition. */
export interface FlagArgument {
  type?: OptionType | string;
  optionalValue?: boolean;
  requiredValue?: boolean;
  variadic?: boolean;
  list?: boolean;
  separator?: string;
}

/** Available build-in argument types. */
export enum OptionType {
  STRING = "string",
  NUMBER = "number",
  INTEGER = "integer",
  BOOLEAN = "boolean",
}

/** Default flag value */
export type DefaultValue<TValue = unknown> =
  | TValue
  | DefaultValueHandler<TValue>;

export type DefaultValueHandler<TValue = unknown> = () => TValue;

/** Value handler for custom value processing. */
// deno-lint-ignore no-explicit-any
export type FlagValueHandler<TValue = any, TReturn = TValue> = (
  val: TValue,
  previous?: TReturn,
) => TReturn;

/** Result of the parseFlags method. */
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
}

/** Type details. */
export interface ArgumentValue {
  label: string;
  type: string;
  name: string;
  value: string;
}

/** Custom type handler/parser. */
export type TypeHandler<TReturn = unknown> = (type: ArgumentValue) => TReturn;
