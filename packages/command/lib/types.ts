import { IFlagArgument, IFlagOptions, ITypeHandler, OptionType } from '../../flags/lib/types.ts';
import { Type } from '../types/type.ts';
import { Command } from './command.ts';

/** Description handler. */
export type IDescription = string | ( ( this: Command ) => string );

/** Action handler. */
export type IAction<O, A extends Array<any>> = ( this: Command, options: O, ...args: A ) => void | Promise<void>;

/** Omit key from object. */
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/** Argument details. */
export interface IArgumentDetails extends IFlagArgument {
    /** Argument name. */
    name: string;
    /** Shell completion action. */
    action: string;
    /** Arguments type. */
    type: OptionType | string;
}

/** Command settings. */
export interface ICommandOption<O = any, A extends Array<any> = any> extends Omit<Omit<Omit<Omit<Omit<Omit<Omit<IFlagOptions,
    'name'>,
    'args'>,
    'type'>,
    'optionalValue'>,
    'aliases'>,
    'variadic'>,
    'list'> {
    override?: boolean;
    hidden?: boolean;
    global?: boolean;
    action?: IAction<O, A>;
}

/** Command option setting's. */
export interface IOption<O = any, A extends Array<any> = any> extends ICommandOption<O, A>, IFlagOptions {
    description: string,
    flags: string;
    typeDefinition?: string;
    args: IArgumentDetails[];
}

export interface IEnvVarOption {
    hidden?: boolean;
    global?: boolean;
}

/** Environment variable setting's. */
export interface IEnvVariable extends IEnvVarOption {
    names: string[];
    description: string;
    type: string;
    details: IArgumentDetails;
}

/** Type option's. */
export interface ITypeOption {
    override?: boolean;
    global?: boolean;
}

/** Type option's. */
export interface ITypeSettings extends ITypeOption {
    name: string;
    handler: Type<any> | ITypeHandler<any>;
}

export type ITypeMap = Map<string, ITypeSettings>;

/** Example setting's. */
export interface IExample {
    name: string;
    description: string;
}

/** Result of `cmd.parse()`. */
export interface IParseResult<O = any, A extends Array<any> = any> {
    options: O;
    args: A;
    literal: string[];
    cmd: Command<O>;
}

export interface ICompleteOptions {
    override?: boolean;
    global?: boolean;
}

export interface ICompleteSettings extends ICompleteOptions {
    name: string;
    complete: ICompleteHandler;
}

/** Type parser method. */
export type ICompleteHandler = ( cmd: Command, parent?: Command ) => string[] | Promise<string[]>;
