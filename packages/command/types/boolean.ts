import { IFlagArgument, IFlagOptions } from '../../flags/lib/types.ts';
import { boolean } from '../../flags/lib/types/boolean.ts';
import { Type } from './type.ts';

export class BooleanType extends Type<boolean> {

    public parse( option: IFlagOptions, arg: IFlagArgument, value: string | false ): boolean | undefined {

        return boolean( option, arg, value );
    }

    public complete(): string[] {

        return [ 'true', 'false' ];
    }
}
