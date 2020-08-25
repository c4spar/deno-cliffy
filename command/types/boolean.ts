import { boolean } from '../../flags/types/boolean.ts';
import { ITypeInfo } from '../types.ts';
import { Type } from '../type.ts';

export class BooleanType extends Type<boolean> {

    public parse( type: ITypeInfo ): boolean {
        return boolean( type );
    }

    public complete(): string[] {
        return [ 'true', 'false' ];
    }
}
