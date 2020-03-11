import { IFlagArgument, IFlagOptions, ITypeHandler } from '../types.ts';

export const number: ITypeHandler<number> = ( option: IFlagOptions, arg: IFlagArgument, value: string | false ): number | undefined => {

    if ( value ) {

        if ( isNaN( value as any ) ) {
            throw new Error( `Option --${ option.name } must be of type number but got: ${ value }` );
        }

        return parseFloat( value );
    }
};
