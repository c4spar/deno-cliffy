import { IFlags } from '../../../flags/lib/types.ts';
import { BaseCommand } from '../../lib/base-command.ts';
import { DefaultCommand } from '../../lib/default-command.ts';
import { ActionListType } from '../../types/action-list.ts';
import { CommandListType } from '../../types/command-list.ts';

/**
 * Execute complete method for specific action and command.
 */
export class CompleteCommand extends DefaultCommand {

    public constructor( protected parent: BaseCommand ) {

        super();

        this.arguments( '<action:action> [command...:command]' )
            .type( 'action', new ActionListType( this.parent ) )
            .type( 'command', new CommandListType( this.parent ) )
            .action( async ( options: IFlags, action: string, commandNames: string[] ) => {

                let cmd: BaseCommand = commandNames
                    .reduce( ( cmd: BaseCommand, name: string ): BaseCommand => cmd.getCommand( name ), parent );

                if ( !cmd ) {
                    console.error( `Auto-completion failed. Command not found: ${ commandNames.join( ' ' ) }` );
                    return;
                }

                const result: string[] = await cmd.getCompletion( action ) || [];

                if ( result && result.length ) {
                    Deno.stdout.writeSync( new TextEncoder().encode( result.join( ' ' ) ) );
                }
            } )
            .default( 'help' )
            .reset();
    }

    /**
     * @inheritDoc
     */
    public command( nameAndArguments: string, cmd?: BaseCommand | string, override?: boolean ): this {

        return super.command( nameAndArguments, cmd || new DefaultCommand(), override );
    }
}
