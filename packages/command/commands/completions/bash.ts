import { BaseCommand } from '../../lib/base-command.ts';

/**
 * Generates bash completion code.
 */
export class BashCompletionsCommand extends BaseCommand {

    public constructor( _cmd?: BaseCommand ) {
        super();
        this.description( 'Generate bash shell completions.' )
            .action( () => {
                throw new Error( 'Bash completions not supported at this moment.' );
            } );
    }
}
