import { IFlags } from '../../flags/lib/types.ts';
import { BaseCommand } from '../lib/base-command.ts';
import { ParentCommandListType } from '../types/parent-command-list.ts';

/**
 * Generates well formatted and colored help output for specified command.
 */
export class HelpCommand extends BaseCommand {

    public constructor( cmd?: BaseCommand ) {
        super();
        this.type( 'command', new ParentCommandListType() )
            .arguments( '[command:command]' )
            .description( 'Show this help or the help of a sub-command.' )
            .action( ( flags: IFlags, name?: string ) => {
                if ( !cmd ) {
                    cmd = name ? this.getGlobalParent()?.getBaseCommand( name ) : this.getGlobalParent();
                }
                if ( !cmd ) {
                    throw new Error( `Failed to generate help for command '${ name }'. Command not found.` );
                }
                cmd.help();
                Deno.exit( 0 );
            } );
    }
}
