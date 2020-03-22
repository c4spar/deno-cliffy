import { IFlagArgument, IFlagOptions, ITypeHandler } from '../types.ts';

export const boolean: ITypeHandler<boolean> = ( option: IFlagOptions, arg: IFlagArgument, value: string | false ): boolean | undefined => {

    if ( typeof arg.optionalValue === 'undefined' ) {
        arg.optionalValue = true;
    }

    if ( !value ) {
        return;
    }

    if ( ~[ '1', 'true' ].indexOf( value ) ) {
        return true;
    }

    if ( ~[ '0', 'false' ].indexOf( value ) ) {
        return false;
    }

    throw new Error( `Option --${ option.name } must be of type boolean but got: ${ value }` );
};
