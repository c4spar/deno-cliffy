import { bold, dim, italic } from 'https://deno.land/std/fmt/colors.ts';
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

        this.description( `Generate shell completions for zsh and bash.

${ dim( bold( 'Bash completions:' ) ) }

To enable bash completions for this program add following line to your ${ dim( italic( '~/.bashrc' ) ) }.

    ${ dim( italic( 'source <(command-name completions bash)' ) ) }

${ dim( bold( 'Zsh completions:' ) ) }

To enable zsh completions for this program add following line to your ${ dim( italic( '~/.zshrc' ) ) }.

    ${ dim( italic( 'source <(command-name completions zsh)' ) ) }
` )
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
