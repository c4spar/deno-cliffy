import type {
  IDefaultValue,
  IFlagArgument,
  IFlagOptions,
  IFlagValueHandler,
  ITypeHandler,
  ITypeInfo,
} from "../flags/types.ts";
import type { Type } from "./type.ts";
import type { Command } from "./command.ts";

export type { IDefaultValue, IFlagValueHandler, ITypeHandler, ITypeInfo };

/* COMMAND TYPES */

/** Description handler. */
export type IDescription = string | ((this: Command) => string);

/** Action handler for commands and options. */
export type IAction<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<any> = any,
  // deno-lint-ignore no-explicit-any
  GO extends Record<string, any> | void = any,
> = (
  this: Command<O, A, GO>,
  options: O & GO,
  ...args: A
) => void | Promise<void>;

/** Argument details. */
export interface IArgument extends IFlagArgument {
  /** Argument name. */
  name: string;
  /** Shell completion action. */
  action: string;
  /** Arguments type. */
  type: string;
}

/** Result of `cmd.parse()` method. */
export interface IParseResult<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<any> = any,
  // deno-lint-ignore no-explicit-any
  GO extends Record<string, any> | void = any,
> {
  options: O & GO;
  args: A;
  literal: string[];
  cmd: Command<O, A, GO>;
}

/* OPTION TYPES */

type ExcludedCommandOptions =
  | "name"
  | "args"
  | "type"
  | "optionalValue"
  | "aliases"
  | "variadic"
  | "list";

/** Command option options. */
export interface ICommandOption<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<any> = any,
  // deno-lint-ignore no-explicit-any
  GO extends Record<string, any> | void = any,
> extends Omit<IFlagOptions, ExcludedCommandOptions> {
  override?: boolean;
  hidden?: boolean;
  global?: boolean;
  action?: IAction<O, A, GO>;
  prepend?: boolean;
}

/** Command option settings. */
export interface IOption<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<any> = any,
  // deno-lint-ignore no-explicit-any
  GO extends Record<string, any> | void = any,
> extends ICommandOption<O, A, GO>, IFlagOptions {
  description: string;
  flags: Array<string>;
  typeDefinition?: string;
  args: IArgument[];
}

/* ENV VARS TYPES */

/** Environment variable options */
export interface IEnvVarOptions {
  hidden?: boolean;
  global?: boolean;
}

/** Environment variable settings. */
export interface IEnvVar extends IEnvVarOptions {
  names: string[];
  description: string;
  type: string;
  details: IArgument;
}

/* TYPE TYPES */

/** Type options. */
export interface ITypeOptions {
  override?: boolean;
  global?: boolean;
}

/** Type settings. */
export interface IType extends ITypeOptions {
  name: string;
  handler: Type<unknown> | ITypeHandler<unknown>;
}

/* EXAMPLE TYPES */

/** Example settings. */
export interface IExample {
  name: string;
  description: string;
}

/* COMPLETION TYPES */

/** Completion options. */
export interface ICompleteOptions {
  override?: boolean;
  global?: boolean;
}

/** Completion settings. */
export interface ICompletion extends ICompleteOptions {
  name: string;
  complete: ICompleteHandler;
}

/** Type parser method. */
export type ICompleteHandler = (
  cmd: Command,
  parent?: Command,
) => string[] | Promise<string[]>;
