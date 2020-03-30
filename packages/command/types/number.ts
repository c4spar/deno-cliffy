import { IFlagArgument, IFlagOptions } from '../../flags/lib/types.ts';
import { number } from '../../flags/lib/types/number.ts';
import { Type } from './type.ts';

export class NumberType extends Type<number> {

    public parse( option: IFlagOptions, arg: IFlagArgument, value: string | false ): number | undefined {

        return number( option, arg, value );
    }

    public complete(): string[] {

        return [];
    }
}
