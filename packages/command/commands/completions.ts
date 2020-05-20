import { bold, dim, italic } from 'https://deno.land/std@v0.50.0/fmt/colors.ts';
import { BaseCommand } from '../lib/base-command.ts';
import { DefaultCommand } from '../lib/default-command.ts';
import { BashCompletionsCommand } from './completions/bash.ts';
import { CompleteCommand } from './completions/complete.ts';
import { ZshCompletionsCommand } from './completions/zsh.ts';

/**
 * Generates source code for interactive shell completions used in multiple shell's.
 */
export class CompletionsCommand extends DefaultCommand {

    public constructor( protected parent: BaseCommand ) {

        super();

        this.description( `Generate shell completions for zsh and bash.

${ dim( bold( 'Bash completions:' ) ) }

To enable bash completions for this program add following line to your ${ dim( italic( '~/.bashrc' ) ) }:

    ${ dim( italic( 'source <(command-name completions bash)' ) ) }

or create a separate file in the ${ dim( italic( 'bash_completion.d' ) ) } directory:

    ${ dim( italic( `${ parent.getPath() } completions bash > /usr/local/etc/bash_completion.d/${ parent.getPath() }.bash` ) ) }
    ${ dim( italic( `source /usr/local/etc/bash_completion.d/${ parent.getPath() }.bash` ) ) }

${ dim( bold( 'Zsh completions:' ) ) }

To enable zsh completions for this program add following line to your ${ dim( italic( '~/.zshrc' ) ) }:

    ${ dim( italic( 'source <(command-name completions zsh)' ) ) }

or create a separate file in the ${ dim( italic( 'zsh_completion.d' ) ) } directory:

    ${ dim( italic( `${ parent.getPath() } completions zsh > /usr/local/etc/zsh_completion.d/${ parent.getPath() }.zsh` ) ) }
    ${ dim( italic( `source /usr/local/etc/zsh_completion.d/${ parent.getPath() }.zsh` ) ) }
` )

            .default( 'help' )
            .command( 'zsh', new ZshCompletionsCommand( this.parent ) )
            .command( 'bash', new BashCompletionsCommand( this.parent ) )
            .command( 'complete', new CompleteCommand( this.parent ).hidden() )
            .reset();
    }

    /**
     * @inheritDoc
     */
    public command( nameAndArguments: string, cmd?: BaseCommand | string, override?: boolean ): this {

        return super.command( nameAndArguments, cmd || new DefaultCommand(), override );
    }
}
