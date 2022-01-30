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
import type { HelpOptions } from "./help/_help_generator.ts";

export type { IDefaultValue, IFlagValueHandler, ITypeHandler, ITypeInfo };

type Id<T> = T extends Record<string, unknown>
  ? T extends infer U ? { [K in keyof U]: Id<U[K]> } : never
  : T;

type Merge<T, V> = T extends void ? V : (V extends void ? T : T & V);

type TypeOrTypeHandler<T> = Type<T> | ITypeHandler<T>;

export type MapTypes<
  T extends Array<unknown> | Record<string, unknown> | void,
> = T extends (Array<unknown> | Record<string, unknown>)
  ? { [K in keyof T]: T[K] extends TypeOrTypeHandler<infer V> ? V : T[K] }
  : T;

/* COMMAND TYPES */

/** Description handler. */
export type IDescription<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  CT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  GT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command<any> | undefined = any,
> = string | ((this: Command<PG, PT, O, A, G, CT, GT, P>) => string);

/** Action handler for commands and options. */
export type IAction<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  CT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  GT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command<any> | undefined = any,
> = (
  this: Command<PG, PT, O, A, G, CT, GT, P>,
  options: Id<MapTypes<Merge<Merge<PG, G>, O>>>,
  ...args: MapTypes<A>
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
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  CT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  GT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command<any> | undefined = any,
> {
  options: Id<Merge<Merge<PG, G>, O>>;
  args: A;
  // options: MapTypes<Merge<Merge<PG, G>, O>>;
  // args: MapTypes<A>;
  literal: string[];
  cmd: Command<PG, PT, O, A, G, CT, GT, P>;
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
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  CT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  GT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command<any> | undefined = any,
> extends Omit<IFlagOptions, ExcludedCommandOptions> {
  override?: boolean;
  hidden?: boolean;
  global?: boolean;
  action?: IAction<O, A, G, PG, CT, GT, PT, P>;
  prepend?: boolean;
}

/** Command option settings. */
export interface IOption<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  CT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  GT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command<any> | undefined = any,
> extends ICommandOption<O, A, G, PG, CT, GT, PT, P>, IFlagOptions {
  description: string;
  flags: Array<string>;
  typeDefinition?: string;
  args: IArgument[];
}

/* ENV VARS TYPES */

// deno-lint-ignore no-explicit-any
export type IEnvVarValueHandler<T extends any = any> = (val: T) => unknown;

/** Environment variable options */
export interface IEnvVarOptions<P extends string = string> {
  hidden?: boolean;
  global?: boolean;
  required?: boolean;
  prefix?: P | undefined;
  value?: IEnvVarValueHandler;
}

/** Environment variable settings. */
export interface IEnvVar<P extends string = string> extends IEnvVarOptions<P> {
  name: string;
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
export interface ICompletion<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  CT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  GT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command<any> | undefined = any,
> extends ICompleteOptions {
  name: string;
  complete: ICompleteHandler<O, A, G, PG, CT, GT, PT, P>;
}

export type CompleteHandlerResult =
  | Array<string | number>
  | Promise<Array<string | number>>;

export type ValuesHandlerResult = Array<string | number>;

/** Type parser method. */
export type ICompleteHandler<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  CT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  GT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command<any> | undefined = any,
> = (
  cmd: Command<PG, PT, O, A, G, CT, GT, P>,
  // deno-lint-ignore no-explicit-any
  parent?: Command<any>,
) => CompleteHandlerResult;

/** Help callback method to print the help. Invoked by the `--help` option and `help` command and the `.getHelp()` and `.showHelp()` method's. */
export type IHelpHandler<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  CT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  GT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command<any> | undefined = any,
  C extends Command<PG, PT, O, A, G, CT, GT, P> = Command<
    PG,
    PT,
    O,
    A,
    G,
    CT,
    GT,
    P
  >,
> = (this: C, cmd: C, options: HelpOptions) => string;

/** Version callback method to print the version. Invoked by the `--help` option command and the `.getVersion()` and `.showHelp()` method's. */
export type IVersionHandler<
  // deno-lint-ignore no-explicit-any
  O extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  A extends Array<unknown> = any,
  // deno-lint-ignore no-explicit-any
  G extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PG extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  CT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  GT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  PT extends Record<string, any> | void = any,
  // deno-lint-ignore no-explicit-any
  P extends Command<any> | undefined = any,
  C extends Command<PG, PT, O, A, G, CT, GT, P> = Command<
    PG,
    PT,
    O,
    A,
    G,
    CT,
    GT,
    P
  >,
> = (this: C, cmd: C) => string;
