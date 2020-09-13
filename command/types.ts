import type {
  IDefaultValue,
  IFlagArgument,
  IFlagOptions,
  ITypeInfo,
  IFlagValueHandler,
  ITypeHandler,
} from "../flags/types.ts";
import type { Type } from "./type.ts";
import type { Command } from "./command.ts";

export type {
  IDefaultValue,
  IFlagValueHandler,
  ITypeHandler,
  ITypeInfo,
};

/* COMMAND TYPES */

/** Description handler. */
export type IDescription = string | ((this: Command) => string);

/** Action handler for commands and options. */
// deno-lint-ignore no-explicit-any
export type IAction<O, A extends Array<any>> = (
  this: Command,
  options: O,
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
// deno-lint-ignore no-explicit-any
export interface IParseResult<O = any, A extends Array<any> = any> {
  options: O;
  args: A;
  literal: string[];
  cmd: Command<O>;
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
// deno-lint-ignore no-explicit-any
export interface ICommandOption<O = any, A extends Array<any> = any>
  extends Omit<IFlagOptions, ExcludedCommandOptions> {
  override?: boolean;
  hidden?: boolean;
  global?: boolean;
  action?: IAction<O, A>;
  prepend?: boolean;
}

/** Command option settings. */
// deno-lint-ignore no-explicit-any
export interface IOption<O = any, A extends Array<any> = any>
  extends ICommandOption<O, A>, IFlagOptions {
  description: string;
  flags: string;
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
