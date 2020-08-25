import { Command } from './command.ts';
import { ITypeInfo } from './types.ts';

export abstract class Type<T> {

    public abstract parse( type: ITypeInfo ): T

    public complete?( cmd: Command, parent?: Command ): string[];
}
