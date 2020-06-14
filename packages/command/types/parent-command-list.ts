import { BaseCommand } from '../lib/base-command.ts';
import { StringType } from './string.ts';

export class ParentCommandListType extends StringType {

    public complete( cmd: BaseCommand, parent?: BaseCommand ): string[] {
        return parent?.getCommands( false )
            .map( ( cmd: BaseCommand ) => cmd.getName() ) || [];
    }
}
