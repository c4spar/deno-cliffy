import { IFlagArgument, IFlagOptions, ITypeHandler } from '../types.ts';

export const string: ITypeHandler<string> = ( option: IFlagOptions, arg: IFlagArgument, value: string | false ): string | undefined => {

    if ( typeof value === 'string' && value.length ) {
        return value;
    }
};
