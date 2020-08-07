import { Command } from '../command.ts';
import { StringType } from './string.ts';

export class ActionListType extends StringType {

    constructor( protected cmd: Command ) {
        super();
    }

    public complete(): string[] {
        return this.cmd.getCompletions()
            .map( type => type.name )
            // filter unique values
            .filter( ( value, index, self ) => self.indexOf( value ) === index );
    }
}
