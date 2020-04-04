import camelCase from '../../x/camelCase.ts';
import { normalize } from './normalize.ts';
import { IFlagArgument, IFlagOptions, IFlags, IFlagsResult, IFlagValue, IFlagValueType, IGenericObject, IParseOptions, IType, OptionType } from './types.ts';
import { boolean } from './types/boolean.ts';
import { number } from './types/number.ts';
import { string } from './types/string.ts';
import { validateFlags } from './validate-flags.ts';

const Types: IGenericObject<IType<any>> = {
    [ OptionType.STRING ]: string,
    [ OptionType.NUMBER ]: number,
    [ OptionType.BOOLEAN ]: boolean
};

/**
 * Parse command line arguments.
 *
 * @param args  Command line arguments e.g: `Deno.args`
 * @param opts  Parse options.
 */
export function parseFlags( args: string[], opts: IParseOptions = {} ): IFlagsResult {

    !opts.flags && ( opts.flags = [] );

    const normalized = normalize( args );
    let option: IFlagOptions | null = null;

    let inLiteral = false;
    let negate = false;

    const flags: IFlags = {};
    const literal: string[] = [];
    const unknown: string[] = [];

    opts.flags.forEach( opt => {
        opt.requires?.forEach( flag => {
            if ( !opts.flags || !getOption( opts.flags, flag ) ) {
                throw new Error( `Unknown required option: ${ flag }` );
            }
        } );
        opt.conflicts?.forEach( flag => {
            if ( !opts.flags || !getOption( opts.flags, flag ) ) {
                throw new Error( `Unknown conflicting option: ${ flag }` );
            }
        } );
    } );

    for ( let i = 0; i < normalized.length; i++ ) {

        const current = normalized[ i ];

        // literal args after --
        if ( inLiteral ) {
            literal.push( current );
            continue;
        }

        if ( current === '--' ) {
            inLiteral = true;
            continue;
        }

        const isFlag = current.length > 1 && current[ 0 ] === '-';
        const next = () => normalized[ i + 1 ];

        if ( isFlag ) {

            if ( current[ 2 ] === '-' || ( current[ 1 ] === '-' && current.length === 3 ) ) {
                throw new Error( `Invalid flag name: ${ current }` );
            }

            negate = current.indexOf( '--no-' ) === 0;

            const name = current.replace( /^-+(no-)?/, '' );

            option = getOption( opts.flags, name );

            if ( !option ) {

                if ( opts.flags.length ) {
                    throw new Error( `Unknown option: ${ current }` );
                }

                option = {
                    name,
                    args: [ {
                        optionalValue: true,
                        type: OptionType.STRING
                    } ]
                };
            } else {

                if ( !option.args || !option.args.length ) {
                    option.args = [ option ];
                }
            }

            if ( !option.name ) {
                throw new Error( `Missing name for option: ${ current }` );
            }

            const friendlyName: string = camelCase( option.name );

            if ( typeof flags[ friendlyName ] !== 'undefined' && !option.collect ) {
                throw new Error( `Duplicate option: ${ current }` );
            }

            let argIndex = 0;
            const previous = flags[ friendlyName ];

            parseNext();

            if ( typeof flags[ friendlyName ] === 'undefined' ) {

                if ( typeof option.default !== 'undefined' ) {
                    flags[ friendlyName ] = typeof option.default === 'function' ? option.default() : option.default;
                } else if ( option.args && option.args[ 0 ].optionalValue ) {
                    flags[ friendlyName ] = true;
                } else {
                    throw new Error( `Missing value for option: --${ option.name }` );
                }
            }

            if ( typeof option.value !== 'undefined' ) {
                flags[ friendlyName ] = option.value( flags[ friendlyName ], previous );
            } else if ( option.collect ) {
                const value = ( previous || [] ) as IFlagValue[];
                value.push( flags[ friendlyName ] as IFlagValue );
                flags[ friendlyName ] = value;
            }

            function parseNext(): void {

                if ( !option ) {
                    throw new Error( 'Wrongly used parseNext.' );
                }

                if ( !option.args || !option.args[ argIndex ] ) {
                    throw new Error( 'Unknown option: ' + next() );
                }

                let arg: IFlagArgument = option.args[ argIndex ];

                if ( negate ) {
                    if ( arg.type !== OptionType.BOOLEAN && !arg.optionalValue ) {
                        throw new Error( `Negate not supported by --${ option.name }. Only optional option or options of type boolean can be negated.` );
                    }
                    flags[ friendlyName ] = false;
                    // don't allow args for negate flags:--no-<flag>
                    // if ( hasNext() ) {
                    //     argIndex++;
                    //     parseNext();
                    // }
                    return;
                }

                let result: IFlagValue | undefined;
                let increase = false;

                if ( arg.list && hasNext() ) {

                    const parsed: IFlagValueType[] = next()
                        .split( arg.separator || ',' )
                        .map( nextValue => {
                            const value = parseValue( nextValue );
                            if ( typeof value === 'undefined' ) {
                                throw new Error( `List item of option --${ option?.name } must be of type ${ option?.type } but got: ${ nextValue }` );
                            }
                            return value;
                        } );

                    if ( parsed?.length ) {
                        result = parsed;
                    }
                } else {
                    result = parseValue( hasNext() && next() );
                }

                if ( increase ) {
                    i++;
                    if ( !arg.variadic ) {
                        argIndex++;
                    } else if ( option.args && option.args[ argIndex + 1 ] ) {
                        throw new Error( 'An argument cannot follow an variadic argument: ' + next() );
                    }
                }

                if ( typeof result !== 'undefined' && ( ( option.args && option.args.length > 1 ) || arg.variadic ) ) {

                    if ( !flags[ friendlyName ] ) {
                        flags[ friendlyName ] = [];
                    }

                    ( flags[ friendlyName ] as IFlagValue[] ).push( result );


                    if ( hasNext() ) {
                        parseNext();
                    }
                } else {
                    flags[ friendlyName ] = result;
                }

                function hasNext(): boolean {

                    return typeof normalized[ i + 1 ] !== 'undefined' &&

                        ( normalized[ i + 1 ][ 0 ] !== '-' ||
                            ( arg.type === OptionType.NUMBER && !isNaN( normalized[ i + 1 ] as any ) )
                        ) &&

                        // ( arg.type !== OptionType.BOOLEAN || [ 'true', 'false', '1', '0' ].indexOf( normalized[ i + 1 ] ) !== -1 ) &&

                        typeof arg !== 'undefined';
                }

                function parseValue( nextValue: string | false ): IFlagValueType | undefined {

                    if ( !option ) {
                        throw new Error( 'Wrongly used parseValue.' );
                    }

                    let result = opts.parse ?
                        opts.parse( arg.type || OptionType.STRING, option, arg, nextValue ) :
                        parseFlagValue( option, arg, nextValue );

                    if ( typeof result !== 'undefined' ) {
                        increase = true;
                    }

                    return result;
                }
            }

        } else {
            unknown.push( current );
        }
    }

    if ( opts.flags && opts.flags.length ) {
        validateFlags( opts.flags, flags, opts.knownFlaks, opts.allowEmpty );
    }

    return { flags, unknown, literal };
}

export function parseFlagValue( option: IFlagOptions, arg: IFlagArgument, nextValue: string | false ): any {

    const type = Types[ arg.type || OptionType.STRING ];

    if ( !type ) {
        throw new Error( `Unknown type ${ arg.type }` );
    }

    return type( option, arg, nextValue );
}

/**
 * Find option by name.
 *
 * @param flags Source option's array.
 * @param name  Name of the option.
 */
export function getOption( flags: IFlagOptions[], name: string ): IFlagOptions | null {

    while ( name[ 0 ] === '-' ) {
        name = name.slice( 1 );
    }

    for ( const flag of flags ) {
        if ( isOption( flag, name ) ) {
            return flag;
        }
    }

    return null;
}

/**
 * Check if option has name or alias.
 *
 * @param option    The option to check.
 * @param name      The option name or alias.
 */
export function isOption( option: IFlagOptions, name: string ) {
    return option.name === name ||
        ( option.aliases && option.aliases.indexOf( name ) !== -1 );
}
