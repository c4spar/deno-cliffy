import { IFlagArgument, IFlagOptions } from '../../flags/types.ts';
import { string } from '../../flags/types/string.ts';
import { Type } from '../type.ts';

export class StringType extends Type<string> {

    public parse( option: IFlagOptions, arg: IFlagArgument, value: string ): string {
        return string( option, arg, value );
    }
}
