import { Command } from '../lib/command.ts';
import { StringType } from './string.ts';

// @TODO: add exclude option

export class CommandListType extends StringType {

    #cmd?: Command;

    constructor( cmd?: Command ) {
        super();
        this.#cmd = cmd;
    }

    public complete( cmd: Command ): string[] {
        return ( this.#cmd ?? cmd )?.getCommands( false )
            .map( ( cmd: Command ) => cmd.getName() ) || [];
    }
}
