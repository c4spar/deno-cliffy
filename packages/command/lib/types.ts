import { BaseCommand } from '../../command/lib/base-command.ts';
import { IFlagArgument, IFlagOptions, IFlags, IFlagValue, OptionType } from '../../flags/lib/types.ts';

/**
 * Command map.
 */
export interface CommandMap {
    name: string;
    aliases: string[];
    cmd: BaseCommand;
}

/**
 * Action handler.
 */
export type IAction = ( options: any, ...args: any[] ) => void | Promise<void>;

/**
 * Omit key from object.
 */
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/**
 * Argument details.
 */
export interface IArgumentDetails extends IFlagArgument {
    name: string;
}

/**
 * Command settings.
 */
export interface ICommandOption extends Omit<Omit<Omit<Omit<Omit<Omit<Omit<IFlagOptions,
    'name'>,
    'args'>,
    'type'>,
    'optionalValue'>,
    'aliases'>,
    'variadic'>,
    'list'> {
    override?: boolean;
    action?: IAction;
}

/**
 * Command option setting's.
 */
export interface IOption extends IFlagOptions {
    description: string,
    flags: string;
    typeDefinition?: string;
    allowEmpty?: boolean;
    action?: IAction;
}

/**
 * Environment variable setting's.
 */
export interface IEnvVariable {
    names: string[];
    description: string;
    type: string;
    details: IArgumentDetails;
}

/**
 * Example setting's.
 */
export interface IExample {
    name: string;
    description: string;
}

/**
 * Result of `cmd.parse()`.
 */
export interface IFlagsParseResult {
    options: IFlags,
    args: IFlagValue[]
    cmd: BaseCommand;
}

export interface IHelpCommand extends BaseCommand {

    show( name?: string ): void;
}

export function isHelpCommand( cmd: BaseCommand ): cmd is IHelpCommand {

    return typeof ( cmd as any ).show === 'function';
}
