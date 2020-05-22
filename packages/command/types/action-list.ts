import { BaseCommand } from '../lib/base-command.ts';
import { StringType } from './string.ts';

export class ActionListType extends StringType {

    constructor( protected cmd: BaseCommand ) {
        super();
    }

    public complete(): string[] {
        return this.cmd.getCompletions()
            .map( type => type.name )
            // filter unique values
            .filter( ( value, index, self ) => self.indexOf( value ) === index );
    }
}
