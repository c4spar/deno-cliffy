import { IFlagArgument, IFlagOptions } from '../../flags/lib/types.ts';
import { Command } from '../lib/command.ts';

export abstract class Type<T> {

    public abstract parse( option: IFlagOptions, arg: IFlagArgument, value: string ): T

    public complete?( cmd: Command, parent?: Command ): string[];
}
