import { BaseCommand } from '../../lib/base-command.ts';
import { ZshCompletionsGenerator } from '../../lib/zsh-completions-generator.ts';

/**
 * Generates zsh completion code.
 */
export class ZshCompletionsCommand extends BaseCommand {

    public constructor( cmd?: BaseCommand ) {
        super();
        this.description( 'Generate zsh shell completions.' )
            .action( () => {
                Deno.stdout.writeSync( new TextEncoder().encode(
                    ZshCompletionsGenerator.generate( cmd || this.getMainCommand() )
                ) );
            } );
    }
}
