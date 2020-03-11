import { BaseCommand } from '../../lib/base-command.ts';
import { DefaultCommand } from '../../lib/default-command.ts';

/**
 * Generates bash completion code.
 */
export class BashCompletionsCommand extends DefaultCommand {

    public constructor( protected parent: BaseCommand ) {

        super();

        this.description( 'Generate bash shell completions.' )
            .action( () => {
                throw new Error( 'Bash completions not supported at this moment.' );
            } );
    }

    /**
     * @inheritDoc
     */
    public command( nameAndArguments: string, cmd?: BaseCommand | string, override?: boolean ): this {

        return super.command( nameAndArguments, cmd || new DefaultCommand(), override );
    }
}
