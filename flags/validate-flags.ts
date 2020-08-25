import { paramCaseToCamelCase } from './_utils.ts';
import { getOption } from './flags.ts';
import { IFlagArgument, IFlagOptions, IFlagValue } from './types.ts';

// @TODO: add support for knownFlaks

interface IFlagOptionsMap {
    name: string;
    option?: IFlagOptions;
}

/**
 * Validate flags.
 *
 * @param flags         Available flag options.
 * @param values        Flag to validate.
 * @param knownFlaks    Don't throw an error if a missing flag is defined in knownFlags (currently not implemented).
 * @param allowEmpty    Don't throw an error if values is empty.
 */
export function validateFlags( flags: IFlagOptions[], values: Record<string, unknown>, knownFlaks?: Record<string, unknown>, allowEmpty?: boolean ): void {

    const defaultValues: Record<string, boolean> = {};
    const optionNames: Record<string, string> = {};
    // Set default value's
    for ( const option of flags ) {
        const name: string = paramCaseToCamelCase( option.name );
        optionNames[ name ] = option.name;
        if ( typeof values[ name ] === 'undefined' && typeof option.default !== 'undefined' ) {
            values[ name ] = typeof option.default === 'function' ? option.default() : option.default;
            defaultValues[ option.name ] = true;
        }
    }

    const keys = Object.keys( values );

    if ( keys.length === 0 && allowEmpty ) {
        return;
    }

    const options: IFlagOptionsMap[] = keys.map( name => ( {
        name,
        option: getOption( flags, optionNames[ name ] )
    } ) );

    for ( const { name, option } of options ) {

        if ( !option ) {
            throw new Error( 'Unknown option: --' + name );
        }

        if ( option.standalone ) {
            if ( keys.length > 1 ) {

                // don't throw an error if all values are coming from the default option.
                if ( options.every( ( { option: opt } ) => opt &&
                    ( option === opt || defaultValues[ opt.name ] ) )
                ) {
                    return;
                }

                throw new Error( `Option --${ option.name } cannot be combined with other options.` );
            }
            return;
        }

        option.conflicts?.forEach( ( flag: string ) => {
            if ( isset( flag ) ) {
                throw new Error( `Option --${ option.name } conflicts with option: --${ flag }` );
            }
        } );

        option.depends?.forEach( ( flag: string ) => {
            // don't throw an error if the value is coming from the default option.
            if ( !isset( flag ) && !defaultValues[ option.name ] ) {
                throw new Error( `Option --${ option.name } depends on option: --${ flag }` );
            }
        } );

        const isArray = ( option.args?.length || 0 ) > 1;

        option.args?.forEach( ( arg: IFlagArgument, i: number ) => {

            if ( arg.requiredValue
                && (
                    typeof values[ name ] === 'undefined'
                    || ( isArray && typeof ( values[ name ] as IFlagValue[] )[ i ] === 'undefined' )
                )
            ) {
                throw new Error( `Missing value for option: --${ option.name }` );
            }
        } );

        function isset( flag: string ): boolean {
            const name = paramCaseToCamelCase( flag );
            // return typeof values[ name ] !== 'undefined' && values[ name ] !== false;
            return typeof values[ name ] !== 'undefined';
        }
    }

    for ( const option of flags ) {

        if ( option.required && !( paramCaseToCamelCase( option.name ) in values ) ) {

            if ( (
                    !option.conflicts ||
                    !option.conflicts.find( ( flag: string ) => !!values[ flag ] )
                ) &&
                !options.find( opt => opt.option?.conflicts?.find( ( flag: string ) => flag === option.name ) )
            ) {
                throw new Error( `Missing required option: --${ option.name }` );
            }
        }

        // console.log( 'args:', JSON.stringify( option.args, null, 2 ) );
    }

    if ( keys.length === 0 && !allowEmpty ) {
        throw new Error( 'No arguments.' );
    }
}
