import { ITypeInfo, ITypeHandler } from '../types.ts';

export const string: ITypeHandler<string> = ( { value }: ITypeInfo ): string => {

    return value;
};
