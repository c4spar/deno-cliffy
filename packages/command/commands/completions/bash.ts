import { Command } from '../../lib/command.ts';

/**
 * Generates bash completion code.
 */
export class BashCompletionsCommand extends Command {

    public constructor( _cmd?: Command ) {
        super();
        this.description( 'Generate bash shell completions.' )
            .action( () => {
                throw new Error( 'Bash completions not supported at this moment.' );
            } );
    }
}
