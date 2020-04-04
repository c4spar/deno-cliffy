import camelCase from '../../x/camelCase.ts';
import paramCase from '../../x/paramCase.ts';
import { getOption } from './flags.ts';
import { IFlagArgument, IFlagOptions, IFlags, IFlagValue } from './types.ts';

// @TODO: add support for knownFlaks

/**
 * Validate flags.
 *
 * @param flags         Available flag options.
 * @param values        Flag to validate.
 * @param knownFlaks    Don't throw an error if a missing flag is defined in knownFlags (currently not implemented).
 * @param allowEmpty    Don't throw an error if values is empty.
 */
export function validateFlags( flags: IFlagOptions[], values: IFlags, knownFlaks?: IFlags, allowEmpty?: boolean ): void {

    const keys = Object.keys( values );

    const options = keys.map( name => ( { name, option: getOption( flags, paramCase( name ) ) } ) );

    // Set default value's
    for ( const option of flags ) {
        const name: string = camelCase( option.name );
        if ( typeof values[ name ] === 'undefined' && typeof option.default !== 'undefined' ) {
            values[ name ] = typeof option.default === 'function' ? option.default() : option.default;
        }
    }

    if ( keys.length === 0 && allowEmpty ) {
        return;
    }

    for ( const { name, option } of options ) {

        if ( !option ) {
            throw new Error( 'Unknown option: --' + name );
        }

        if ( option.standalone ) {
            if ( keys.length > 1 ) {
                throw new Error( `Option --${ option.name } cannot be combined with other options.` );
            }
            return;
        }

        option.conflicts?.forEach( flag => {
            if ( isset( flag ) ) {
                throw new Error( `Option --${ option.name } conflicts with option: --${ flag }` );
            }
        } );

        option.requires?.forEach( flag => {
            if ( !isset( flag ) ) {
                throw new Error( `Option --${ option.name } depends on option: --${ flag }` );
            }
        } );

        const isArray = ( option.args?.length || 0 ) > 1;

        option.args?.forEach( ( arg: IFlagArgument, i: number ) => {

            if ( !arg.optionalValue
                && (
                    typeof values[ name ] === 'undefined'
                    || ( isArray && typeof ( values[ name ] as IFlagValue[] )[ i ] === 'undefined' )
                )
            ) {
                throw new Error( `Missing value for option: --${ option.name }` );
            }
        } );

        function isset( flag: string ): boolean {
            const name = camelCase( flag );
            // return typeof values[ name ] !== 'undefined' && values[ name ] !== false;
            return typeof values[ name ] !== 'undefined';
        }
    }

    for ( const option of flags ) {

        if ( option.required && !( camelCase( option.name ) in values ) ) {

            if ( (
                    !option.conflicts ||
                    !option.conflicts.find( flag => !!values[ flag ] )
                ) &&
                !options.find( opt => opt.option?.conflicts?.find( flag => flag === option.name ) )
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
