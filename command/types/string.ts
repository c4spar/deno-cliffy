import { ITypeInfo } from '../../flags/types.ts';
import { string } from '../../flags/types/string.ts';
import { Type } from '../type.ts';

export class StringType extends Type<string> {

    public parse( type: ITypeInfo ): string {
        return string( type );
    }
}
