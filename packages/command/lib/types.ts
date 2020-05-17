import { BaseCommand } from '../../command/lib/base-command.ts';
import { IFlagArgument, IFlagOptions, IFlagValue, IGenericObject, OptionType } from '../../flags/lib/types.ts';

/** Command map. */
export interface CommandMap<O = any> {
    name: string;
    aliases: string[];
    cmd: BaseCommand<O>;
}

/** Action handler. */
export type IAction<O> = ( options: O, ...args: any[] ) => void | Promise<void>;

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
export interface ICommandOption<O> extends Omit<Omit<Omit<Omit<Omit<Omit<Omit<IFlagOptions,
    'name'>,
    'args'>,
    'type'>,
    'optionalValue'>,
    'aliases'>,
    'variadic'>,
    'list'> {
    override?: boolean;
    action?: IAction<O>;
}

/** Command option setting's. */
export interface IOption<O = any> extends ICommandOption<O>, IFlagOptions {
    description: string,
    flags: string;
    typeDefinition?: string;
    args: IArgumentDetails[];
}

/** Environment variable setting's. */
export interface IEnvVariable {
    names: string[];
    description: string;
    type: string;
    details: IArgumentDetails;
}

/** Example setting's. */
export interface IExample {
    name: string;
    description: string;
}

/** Result of `cmd.parse()`. */
export interface IFlagsParseResult<O> {
    options: O,
    args: IFlagValue[]
    cmd: BaseCommand<O>;
}

/** Type parser method. */
export type ICompleteHandler = () => string[] | Promise<string[]>;

/** Map of type handlers. */
export type ICompleteHandlerMap = IGenericObject<ICompleteHandler>

export interface IHelpCommand<O = any> extends BaseCommand<O> {
    show( name?: string ): void;
}

export function isHelpCommand<O = any>( cmd: BaseCommand<O> ): cmd is IHelpCommand<O> {

    return typeof ( cmd as any ).show === 'function';
}
