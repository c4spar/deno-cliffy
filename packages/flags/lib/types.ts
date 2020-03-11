export interface IGenericObject<T> {
    [ name: string ]: T;
}

export type IType<T> = ( option: IFlagOptions, arg: IFlagArgument, value: string | false ) => T | undefined;

export enum OptionType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
}

/**
 * Flag value type.
 */
export type IFlagValueType = string | boolean | number;

/**
 *
 */
export type IFlagValue = IFlagValueType | IFlagValueType[];

/**
 * An object which represents all flags.
 */
export type IFlags = IGenericObject<undefined | IFlagValue | IFlagValue[]>;

/**
 * Parse result.
 */
export interface IFlagsResult {
    flags: IFlags;
    unknown: string[];
    literal: string[];
}

/**
 * Flag argument definition.
 */
export interface IFlagArgument {
    type?: OptionType | string;
    optionalValue?: boolean;
    variadic?: boolean;
    list?: boolean;
    separator?: string;
}

/**
 * Flag value handler for custom value processing.
 */
export type IFlagValueHandler<T = any> = ( val: any, previous?: T ) => T;

/**
 * Flag settings.
 */
export interface IFlagOptions extends IFlagArgument {
    name: string;
    args?: IFlagArgument[];
    aliases?: string[];
    standalone?: boolean;
    default?: IFlagValue,
    required?: boolean;
    requires?: string[];
    conflicts?: string[];
    value?: IFlagValueHandler;
    collect?: boolean;
}

/**
 * Type parser method.
 */
export type ITypeHandler<T> = ( option: IFlagOptions, arg: IFlagArgument, nextValue: string | false ) => T | undefined;

/**
 * Map of type handlers.
 */
export type ITypeHandlerMap = IGenericObject<ITypeHandler<any>>

/**
 * Parse settings.
 */
export interface IParseOptions {
    stopEarly?: boolean;
    allowEmpty?: boolean;
    flags?: IFlagOptions[];
    knownFlaks?: IFlags;
    types?: ITypeHandlerMap;
}
