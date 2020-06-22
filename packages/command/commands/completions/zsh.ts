import { Command } from '../../lib/command.ts';
import { ZshCompletionsGenerator } from '../../lib/zsh-completions-generator.ts';

/**
 * Generates zsh completion code.
 */
export class ZshCompletionsCommand extends Command {

    public constructor( cmd?: Command ) {
        super();
        this.description( 'Generate zsh shell completions.' )
            .action( () => {
                Deno.stdout.writeSync( new TextEncoder().encode(
                    ZshCompletionsGenerator.generate( cmd || this.getMainCommand() )
                ) );
            } );
    }
}
