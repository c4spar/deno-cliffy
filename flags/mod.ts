export { parseFlags } from "./flags.ts";
export {
  type ArgumentOptions,
  type ArgumentType,
  type ArgumentValue,
  type DefaultValue,
  type DefaultValueHandler,
  type FlagOptions,
  type ParseFlagsContext,
  type ParseFlagsOptions,
  type TypeHandler,
  type ValueHandler,
} from "./types.ts";
export { boolean } from "./types/boolean.ts";
export { integer } from "./types/integer.ts";
export { number } from "./types/number.ts";
export { string } from "./types/string.ts";
export {
  type IDefaultValue,
  type IFlagArgument,
  type IFlagOptions,
  type IFlagsResult,
  type IFlagValueHandler,
  type IParseOptions,
  type ITypeHandler,
  type ITypeInfo,
  OptionType,
} from "./deprecated.ts";
export {
  InvalidTypeError,
  UnexpectedArgumentAfterVariadicArgumentError,
  UnexpectedRequiredArgumentError,
  UnknownTypeError,
  ValidationError,
} from "./_errors.ts";
