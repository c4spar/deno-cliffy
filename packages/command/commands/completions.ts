import { dim, italic } from 'https://deno.land/std@0.63.0/fmt/colors.ts';
import { Command } from '../lib/command.ts';
// import { BashCompletionsCommand } from './completions/bash.ts';
import { CompleteCommand } from './completions/complete.ts';
import { ZshCompletionsCommand } from './completions/zsh.ts';

/**
 * Generates source code for interactive shell completions used in multiple shell's.
 */
export class CompletionsCommand extends Command {

    public constructor( cmd?: Command ) {

        super();

        this.description( 'Generate shell completions.' )
            .description( () => {
                cmd = cmd || this.getMainCommand();
                return `Generate shell completions.

To enable shell completions for this program add following line to your ${ dim( italic( '~/.bashrc' ) ) } or similar:

    ${ dim( italic( `source <(${ cmd.getPath() } completions [shell])` ) ) }

    For mor information run ${ dim( italic( `${ cmd.getPath() } completions [shell] --help` ) ) }
`;
            } )
            .default( 'help' )
            .command( 'zsh', new ZshCompletionsCommand( cmd ) )
            // .command( 'bash', new BashCompletionsCommand( cmd ) )
            .command( 'complete', new CompleteCommand( cmd ).hidden() )
            .reset();
    }
}
