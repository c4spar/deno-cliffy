import { encode } from 'https://deno.land/std@v0.52.0/encoding/utf8.ts';
import { IFlags } from '../../../flags/lib/types.ts';
import { BaseCommand } from '../../lib/base-command.ts';
import { DefaultCommand } from '../../lib/default-command.ts';
import { ICompleteSettings } from '../../lib/types.ts';

/**
 * Execute complete method for specific action and command.
 */
export class CompleteCommand extends DefaultCommand {

    public constructor( cmd?: BaseCommand ) {
        super();
        this.description( 'Get completions for given action from given command.' )
            .arguments( '<action:action> [command...:command]' )
            .action( async ( options: IFlags, action: string, commandNames: string[] ) => {

                let parent: BaseCommand | undefined;
                let completeCommand: BaseCommand = commandNames
                    .reduce( ( cmd: BaseCommand, name: string ): BaseCommand => {
                        parent = cmd;
                        const childCmd: BaseCommand | undefined = cmd.getCommand( name, false );
                        if ( !childCmd ) {
                            throw new Error( `Auto-completion failed. Command not found: ${ commandNames.join( ' ' ) }` );
                        }
                        return childCmd;
                    }, cmd || this.getMainCommand() );

                const completion: ICompleteSettings | undefined = completeCommand.getCompletion( action );
                const result: string[] = await completion?.complete( completeCommand, parent ) ?? [];

                if ( result?.length ) {
                    Deno.stdout.writeSync( encode( result.join( ' ' ) ) );
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
