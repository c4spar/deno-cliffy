import { IFlagArgument, IFlagOptions } from '../../flags/types.ts';
import { number } from '../../flags/types/number.ts';
import { Type } from '../type.ts';

export class NumberType extends Type<number> {

    public parse( option: IFlagOptions, arg: IFlagArgument, value: string ): number {
        return number( option, arg, value );
    }
}
