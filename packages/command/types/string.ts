import { IFlagArgument, IFlagOptions } from '../../flags/lib/types.ts';
import { string } from '../../flags/lib/types/string.ts';
import { Type } from './type.ts';

export class StringType extends Type<string> {

    public parse( option: IFlagOptions, arg: IFlagArgument, value: string | false ): string | undefined {

        return string( option, arg, value );
    }
}
