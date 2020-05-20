import { BaseCommand } from '../../command/lib/base-command.ts';
import { IFlagArgument, IFlagOptions, IGenericObject, OptionType } from '../../flags/lib/types.ts';

/** Command map. */
export interface CommandMap<O = any> {
    name: string;
    aliases: string[];
    cmd: BaseCommand<O>;
}

/** Action handler. */
export type IAction<O, A extends Array<any>> = ( options: O, ...args: A ) => void | Promise<void>;

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
export interface ICommandOption<O, A extends Array<any>> extends Omit<Omit<Omit<Omit<Omit<Omit<Omit<IFlagOptions,
    'name'>,
    'args'>,
    'type'>,
    'optionalValue'>,
    'aliases'>,
    'variadic'>,
    'list'> {
    override?: boolean;
    action?: IAction<O, A>;
}

/** Command option setting's. */
export interface IOption<O = any, A extends Array<any> = any> extends ICommandOption<O, A>, IFlagOptions {
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
export interface IParseResult<O, A> {
    options: O,
    args: A
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
