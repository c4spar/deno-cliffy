import { IFlagArgument, IFlagOptions } from '../flags/types.ts';
import { Command } from './command.ts';

export abstract class Type<T> {

    public abstract parse( option: IFlagOptions, arg: IFlagArgument, value: string ): T

    public complete?( cmd: Command, parent?: Command ): string[];
}
