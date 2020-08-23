import { ITypeInfo } from '../../flags/types.ts';
import { number } from '../../flags/types/number.ts';
import { Type } from '../type.ts';

export class NumberType extends Type<number> {

    public parse( type: ITypeInfo ): number {
        return number( type );
    }
}
