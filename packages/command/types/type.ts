import { IFlagArgument, IFlagOptions } from '../../flags/lib/types.ts';
import { BaseCommand } from '../lib/base-command.ts';

export abstract class Type<T> {

    public abstract parse( option: IFlagOptions, arg: IFlagArgument, value: string ): T

    public complete?( cmd: BaseCommand ): string[];
}
