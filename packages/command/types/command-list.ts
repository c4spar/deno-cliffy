import { BaseCommand } from '../lib/base-command.ts';
import { StringType } from './string.ts';

export class CommandListType extends StringType {

    constructor( protected cmd: BaseCommand ) {
        super();
    }

    public complete(): string[] {
        return this.cmd.getCommands().map( ( cmd: BaseCommand ) => cmd.getName() );
    }
}
