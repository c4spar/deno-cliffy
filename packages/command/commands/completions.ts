import { BaseCommand } from '../lib/base-command.ts';
import { DefaultCommand } from '../lib/default-command.ts';
import { BashCompletionsCommand } from './completions/bash.ts';
import { ZshCompletionsCommand } from './completions/zsh.ts';

/**
 * Generates source code for interactive shell completions used in multiple shell's.
 */
export class CompletionsCommand extends DefaultCommand {

    public constructor( protected parent: BaseCommand ) {

        super();

        this.description( 'Generate shell completions for zsh and bash.' )
            .command( 'zsh', new ZshCompletionsCommand( this.parent ) )
            .command( 'bash', new BashCompletionsCommand( this.parent ) )
            .reset();
    }

    /**
     * @inheritDoc
     */
    public command( nameAndArguments: string, cmd?: BaseCommand | string, override?: boolean ): this {

        return super.command( nameAndArguments, cmd || new DefaultCommand(), override );
    }
}
