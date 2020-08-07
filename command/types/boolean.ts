import { IFlagArgument, IFlagOptions } from '../../flags/types.ts';
import { boolean } from '../../flags/types/boolean.ts';
import { Type } from '../type.ts';

export class BooleanType extends Type<boolean> {

    public parse( option: IFlagOptions, arg: IFlagArgument, value: string ): boolean {
        return boolean( option, arg, value );
    }

    public complete(): string[] {
        return [ 'true', 'false' ];
    }
}
