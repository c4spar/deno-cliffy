/** Parser options. */
export interface IParseOptions<T extends FlagOptions = FlagOptions> {
  flags?: Array<T>;
  parse?: ITypeHandler<unknown>;
  option?: (option: T, value?: unknown) => void;
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
  default?: IDefaultValue;
  required?: boolean;
  depends?: string[];
  conflicts?: string[];
  value?: IFlagValueHandler;
  collect?: boolean;
  equalsSign?: boolean;
}

export interface SingleFlagOptions extends BaseFlagOptions, BaseArgument {
  optionalValue?: boolean;
}

export interface ValueFlagOptions extends BaseFlagOptions {
  args: Array<FlagArgument>;
}

export type FlagOptions = SingleFlagOptions | ValueFlagOptions;

export interface BaseArgument {
  type?: OptionType | string;
  variadic?: boolean;
  list?: boolean;
  separator?: string;
}

export interface FlagArgument extends BaseArgument {
  optional?: boolean;
}

/** Available build-in argument types. */
export enum OptionType {
  STRING = "string",
  NUMBER = "number",
  INTEGER = "integer",
  BOOLEAN = "boolean",
}

/** Default flag value */
export type IDefaultValue<T = unknown> = T | (() => T);

/** Value handler for custom value processing. */
// deno-lint-ignore no-explicit-any
export type IFlagValueHandler<T = any, U = T> = (val: T, previous?: U) => U;

/** Result of the parseFlags method. */
export interface IFlagsResult<
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
export interface ITypeInfo {
  label: string;
  type: string;
  name: string;
  value: string;
}

/** Custom type handler/parser. */
export type ITypeHandler<T = unknown> = (type: ITypeInfo) => T;
