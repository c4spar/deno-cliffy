import { stripeColors } from '../../../table/lib/utils.ts';
import { Command } from '../../lib/command.ts';
import { assertEquals } from '../lib/assert.ts';

function command(): Command {
    return new Command()
        .throwErrors()
        .version( '1.0.0' )
        .description( 'Test description ...' )
        .option( '-h, --hidden <value:string>', 'Nobody knows about me!', { hidden: true } )
        .hidden();
}

Deno.test( 'hidden option', async () => {

    const cmd: Command = command();
    const { options, args } = await cmd.parse( [ '--hidden', 'test' ] );

    assertEquals( options, { hidden: 'test' } );
    assertEquals( args, [] );
} );

Deno.test( 'hidden option help', async () => {

    const cmd: Command = command();
    const output: string = cmd.getHelp();

    assertEquals( stripeColors( output ), `
  Usage:   COMMAND
  Version: v1.0.0 

  Description:

    Test description ...

  Options:

    -h, --help       - Show this help.                            
    -V, --version    - Show the version number for this program.  

  Commands:

    help         [command:command]  - Show this help or the help of a sub-command.
    completions                     - Generate shell completions for zsh and bash.

` );
} );
