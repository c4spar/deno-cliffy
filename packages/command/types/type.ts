import { IFlagArgument, IFlagOptions } from '../../flags/lib/types.ts';

export abstract class Type<T> {

    public abstract parse( option: IFlagOptions, arg: IFlagArgument, value: string | false ): T | undefined

    public complete(): string[] {
        return [];
    }
}
