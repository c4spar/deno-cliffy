import { BaseCommand } from '../lib/base-command.ts';
import { StringType } from './string.ts';

// @TODO: add exclude option

export class CommandListType extends StringType {

    #cmd?: BaseCommand;

    constructor( cmd?: BaseCommand ) {
        super();
        this.#cmd = cmd;
    }

    public complete( cmd: BaseCommand ): string[] {
        return ( this.#cmd ?? cmd )?.getCommands( false )
            .map( ( cmd: BaseCommand ) => cmd.getName() ) || [];
    }
}
