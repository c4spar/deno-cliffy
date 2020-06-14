import { BaseCommand } from '../../lib/base-command.ts';
import { DefaultCommand } from '../../lib/default-command.ts';
import { ZshCompletionsGenerator } from '../../lib/zsh-completions-generator.ts';

/**
 * Generates zsh completion code.
 */
export class ZshCompletionsCommand extends DefaultCommand {

    public constructor( cmd?: BaseCommand ) {
        super();
        this.description( 'Generate zsh shell completions.' )
            .action( () => {
                Deno.stdout.writeSync( new TextEncoder().encode(
                    ZshCompletionsGenerator.generate( cmd || this.getMainCommand() )
                ) );
            } );
    }

    /**
     * @inheritDoc
     */
    public command( nameAndArguments: string, cmd?: BaseCommand | string, override?: boolean ): this {
        return super.command( nameAndArguments, cmd || new DefaultCommand(), override );
    }
}
