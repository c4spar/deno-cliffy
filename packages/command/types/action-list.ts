import { BaseCommand } from '../lib/base-command.ts';
import { StringType } from './string.ts';

export class ActionListType extends StringType {

    constructor( protected cmd: BaseCommand ) {
        super();
    }

    public complete(): string[] {

        return this.getActionNames( this.cmd )
                   .filter( ( value, index, self ) => self.indexOf( value ) === index ); // filter unique values
    }

    protected getActionNames( cmd: BaseCommand ): string[] {

        const actions: string[] = cmd.getActionNames();

        for ( const command of cmd.getCommands() ) {
            actions.push( ...this.getActionNames( command ) );
        }

        return actions;
    }
}
