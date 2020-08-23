import { ITypeInfo } from '../flags/types.ts';
import { Command } from './command.ts';

export abstract class Type<T> {

    public abstract parse( type: ITypeInfo ): T

    public complete?( cmd: Command, parent?: Command ): string[];
}
