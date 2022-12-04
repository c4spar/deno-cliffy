// deno-lint-ignore-file no-explicit-any

import type {
  ArgumentOptions,
  ArgumentValue,
  BaseFlagOptions,
  DefaultValue,
  TypeHandler,
  ValueHandler,
} from "../flags/types.ts";
import type { ValidationError } from "./_errors.ts";
import type { Command } from "./command.ts";
import type { HelpOptions } from "./help/_help_generator.ts";
import type { Type } from "./type.ts";

export type { ArgumentValue, DefaultValue, TypeHandler };

type Merge<T, V> = T extends void ? V : V extends void ? T : T & V;

export type TypeOrTypeHandler<TType extends string, TValue> =
  | Type<TType, TValue>
  | TypeHandler<TType, TValue>;

type Id<TValue> = TValue extends Record<string, unknown>
  ? TValue extends infer U ? { [K in keyof U]: Id<U[K]> } : never
  : TValue;

export type MapTypes<T> = T extends Record<string, unknown> | Array<unknown>
  ? { [K in keyof T]: MapTypes<T[K]> }
  : Type.infer<T>;

/* COMMAND TYPES */

/** Description handler. */
export type Description<
  TOptions extends Record<string, any> | void = any,
  TArguments extends Array<unknown> = TOptions extends number ? any : [],
  TGlobals extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TParentGlobals extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TTypes extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TGlobalTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentCommand extends Command<any> | undefined = TOptions extends number
    ? any
    : undefined,
> =
  | string
  | DescriptionHandler<
    TOptions,
    TArguments,
    TGlobals,
    TParentGlobals,
    TTypes,
    TGlobalTypes,
    TParentTypes,
    TParentCommand
  >;

/** Description handler. */
export type DescriptionHandler<
  TOptions extends Record<string, any> | void = any,
  TArguments extends Array<unknown> = TOptions extends number ? any : [],
  TGlobals extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TParentGlobals extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TTypes extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TGlobalTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentCommand extends Command<any> | undefined = TOptions extends number
    ? any
    : undefined,
> = (
  this: Command<
    TParentGlobals,
    TParentTypes,
    TOptions,
    TArguments,
    TGlobals,
    TTypes,
    TGlobalTypes,
    TParentCommand
  >,
) => string;

/** Action handler for commands and options. */
export type ActionHandler<
  TOptions extends Record<string, any> | void = any,
  TArguments extends Array<unknown> = TOptions extends number ? any : [],
  TGlobals extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TParentGlobals extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TTypes extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TGlobalTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentCommand extends Command<any> | undefined = TOptions extends number
    ? any
    : undefined,
> = (
  this: Command<
    TParentGlobals,
    TParentTypes,
    TOptions,
    TArguments,
    TGlobals,
    TTypes,
    TGlobalTypes,
    TParentCommand
  >,
  options: MapTypes<Merge<TParentGlobals, Merge<TGlobals, TOptions>>>,
  ...args: MapTypes<TArguments>
) => unknown | Promise<unknown>;

/** Argument details. */
export interface Argument<TType extends string = string>
  extends ArgumentOptions<TType> {
  /** Argument name. */
  name: string;
  /** Shell completion action. */
  action: string;
}

/** Result of `cmd.parse()` method. */
export interface CommandResult<
  TOptions extends Record<string, any> | void = any,
  TArguments extends Array<unknown> = TOptions extends number ? any : [],
  TGlobals extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TParentGlobals extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TTypes extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TGlobalTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentCommand extends Command<any> | undefined = TOptions extends number
    ? any
    : undefined,
> {
  options: Id<Merge<Merge<TParentGlobals, TGlobals>, TOptions>>;
  args: TArguments;
  literal: string[];
  cmd: Command<
    TParentGlobals,
    TParentTypes,
    TOptions,
    TArguments,
    TGlobals,
    TTypes,
    TGlobalTypes,
    TParentCommand
  >;
}

/* OPTION TYPES */

export type OptionValueHandler<TValue = any, TReturn = TValue> = ValueHandler<
  TValue,
  TReturn
>;

/** Command option options. */
export interface GlobalOptionOptions<
  TOptions extends Record<string, any> | void = any,
  TArguments extends Array<unknown> = TOptions extends number ? any : [],
  TGlobals extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TParentGlobals extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TTypes extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TGlobalTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentCommand extends Command<any> | undefined = TOptions extends number
    ? any
    : undefined,
> extends Omit<BaseFlagOptions, "name" | "aliases" | "equalsSign"> {
  override?: boolean;
  hidden?: boolean;
  action?: ActionHandler<
    TOptions,
    TArguments,
    TGlobals,
    TParentGlobals,
    TTypes,
    TGlobalTypes,
    TParentTypes,
    TParentCommand
  >;
  prepend?: boolean;
  value?: OptionValueHandler;
  separator?: string;
}

export interface OptionOptions<
  TOptions extends Record<string, any> | void = any,
  TArguments extends Array<unknown> = TOptions extends number ? any : [],
  TGlobals extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TParentGlobals extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TTypes extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TGlobalTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentCommand extends Command<any> | undefined = TOptions extends number
    ? any
    : undefined,
> extends
  GlobalOptionOptions<
    TOptions,
    TArguments,
    TGlobals,
    TParentGlobals,
    TTypes,
    TGlobalTypes,
    TParentTypes,
    TParentCommand
  > {
  global?: boolean;
}

/** Command option settings. */
export interface Option<
  TOptions extends Record<string, any> | void = any,
  TArguments extends Array<unknown> = TOptions extends number ? any : [],
  TGlobals extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TParentGlobals extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TTypes extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TGlobalTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentCommand extends Command<any> | undefined = TOptions extends number
    ? any
    : undefined,
> extends
  OptionOptions<
    TOptions,
    TArguments,
    TGlobals,
    TParentGlobals,
    TTypes,
    TGlobalTypes,
    TParentTypes,
    TParentCommand
  >,
  BaseFlagOptions {
  description: string;
  flags: Array<string>;
  typeDefinition?: string;
  args: Array<Argument<Extract<keyof TTypes & keyof TGlobalTypes, string>>>;
  groupName?: string;
  separator?: string;
}

/* ENV VARS TYPES */

export type EnvVarValueHandler<TValue = any, TReturn = TValue> = (
  val: TValue,
) => TReturn;

/** Environment variable options */
export interface GlobalEnvVarOptions {
  hidden?: boolean;
  required?: boolean;
  prefix?: string | undefined;
  value?: EnvVarValueHandler;
}

/** Environment variable options */
export interface EnvVarOptions extends GlobalEnvVarOptions {
  global?: boolean;
}

/** Environment variable settings. */
export interface EnvVar<TType extends string = string> extends EnvVarOptions {
  name: string;
  names: string[];
  description: string;
  // @TODO: extend EnvVar from Argument
  type: TType;
  details: Argument<TType>;
}

/* TYPE TYPES */

/** Type options. */
export interface TypeOptions {
  override?: boolean;
  global?: boolean;
}

/** Type settings. */
export interface TypeDef<TType extends string = string, TReturn = unknown>
  extends TypeOptions {
  name: string;
  handler: TypeOrTypeHandler<TType, TReturn>;
}

/* EXAMPLE TYPES */

/** Example settings. */
export interface Example {
  name: string;
  description: string;
}

/* COMPLETION TYPES */

/** Completion options. */
export interface CompleteOptions {
  override?: boolean;
  global?: boolean;
}

/** Completion settings. */
export interface Completion<
  TOptions extends Record<string, any> | void = any,
  TArguments extends Array<unknown> = TOptions extends number ? any : [],
  TGlobals extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TParentGlobals extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TTypes extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TGlobalTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentCommand extends Command<any> | undefined = TOptions extends number
    ? any
    : undefined,
> extends CompleteOptions {
  name: string;
  complete: CompleteHandler<
    TOptions,
    TArguments,
    TGlobals,
    TParentGlobals,
    TTypes,
    TGlobalTypes,
    TParentTypes,
    TParentCommand
  >;
}

export type CompleteHandlerResult =
  | Array<string | number | boolean>
  | Promise<Array<string | number | boolean>>;

export type ValuesHandlerResult = Array<string | number | boolean>;

/** Type parser method. */
export type CompleteHandler<
  TOptions extends Record<string, any> | void = any,
  TArguments extends Array<unknown> = TOptions extends number ? any : [],
  TGlobals extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TParentGlobals extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TTypes extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TGlobalTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentCommand extends Command<any> | undefined = TOptions extends number
    ? any
    : undefined,
> = (
  cmd: Command<
    TParentGlobals,
    TParentTypes,
    TOptions,
    TArguments,
    TGlobals,
    TTypes,
    TGlobalTypes,
    TParentCommand
  >,
  parent?: Command<any>,
) => CompleteHandlerResult;

/* HELP */

/**
 * Help callback method to print the help.
 * Invoked by the `--help` option and `help` command and the `.getHelp()` and `.showHelp()` methods.
 */
export type HelpHandler<
  TOptions extends Record<string, any> | void = any,
  TArguments extends Array<unknown> = TOptions extends number ? any : [],
  TGlobals extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TParentGlobals extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TTypes extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TGlobalTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentCommand extends Command<any> | undefined = TOptions extends number
    ? any
    : undefined,
  TCommand extends Command<
    TParentGlobals,
    TParentTypes,
    TOptions,
    TArguments,
    TGlobals,
    TTypes,
    TGlobalTypes,
    TParentCommand
  > = Command<
    TParentGlobals,
    TParentTypes,
    TOptions,
    TArguments,
    TGlobals,
    TTypes,
    TGlobalTypes,
    TParentCommand
  >,
> = (this: TCommand, cmd: TCommand, options: HelpOptions) => string;

/**
 * Version callback method to print the version.
 * Invoked by the `--help` option command and the `.getVersion()` and `.showHelp()` methods.
 */
export type VersionHandler<
  TOptions extends Record<string, any> | void = any,
  TArguments extends Array<unknown> = TOptions extends number ? any : [],
  TGlobals extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TParentGlobals extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TTypes extends Record<string, any> | void = TOptions extends number ? any
    : void,
  TGlobalTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentTypes extends Record<string, any> | void = TOptions extends number
    ? any
    : void,
  TParentCommand extends Command<any> | undefined = TOptions extends number
    ? any
    : undefined,
  TCommand extends Command<
    TParentGlobals,
    TParentTypes,
    TOptions,
    TArguments,
    TGlobals,
    TTypes,
    TGlobalTypes,
    TParentCommand
  > = Command<
    TParentGlobals,
    TParentTypes,
    TOptions,
    TArguments,
    TGlobals,
    TTypes,
    TGlobalTypes,
    TParentCommand
  >,
> = (this: TCommand, cmd: TCommand) => string;

export type ErrorHandler = (
  error: Error | ValidationError,
  cmd: Command,
) => unknown;
