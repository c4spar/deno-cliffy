import { stripeColors } from '../../../table/lib/utils.ts';
import { Command } from '../../lib/command.ts';
import { assertEquals } from '../lib/assert.ts';

Deno.test( 'hidden command help', async () => {

    const cmd: Command = new Command()
        .throwErrors()
        .version( '1.0.0' )
        .description( 'Test description ...' )
        .option( '-t, --test [val:string]', 'test description' )
        .option( '-D, --default [val:string]', 'I have a default value!', { default: 'test' } )
        .option( '-r, --required [val:string]', 'I am required!', { required: true } )
        .option( '-H, --hidden [val:string]', 'Nobody knows about me!', { hidden: true } )
        .option( '-d, --depends [val:string]', 'I depend on test!', { depends: [ 'test' ] } )
        .option( '-c, --conflicts [val:string]', 'I conflict with test!', { conflicts: [ 'test' ] } )
        .option( '-a, --all <val:string>', 'I have many hints!', {
            default: 'test',
            required: true,
            depends: [ 'test' ],
            conflicts: [ 'depends' ]
        } )
        .command( 'sub-command <input:string> <output:string>' )
        .description( 'sub command description.' )
        .command( 'hidden-command <input:string> <output:string>' )
        .description( 'Nobody knows about me!' )
        .hidden();

    const output: string = cmd.getHelpCommand().getHelp();

    assertEquals( stripeColors( output ), `
  Usage:   COMMAND
  Version: v1.0.0 

  Description:

    Test description ...

  Options:

    -h, --help       [arg:boolean]  - Show this help.                            
    -V, --version    [arg:boolean]  - Show the version number for this program.  
    -t, --test       [val:string]   - test description                           
    -D, --default    [val:string]   - I have a default value!                    (Default: test)
    -r, --required   [val:string]   - I am required!                             (required)
    -d, --depends    [val:string]   - I depend on test!                          (depends: test)
    -c, --conflicts  [val:string]   - I conflict with test!                      (conflicts: test)
    -a, --all        <val:string>   - I have many hints!                         (required, Default: test, depends: test, conflicts: depends)

  Commands:

    help         [command:command]               - Show this help or the help of a sub-command.
    completions                                  - Generate shell completions for zsh and bash.
    sub-command  <input:string> <output:string>  - sub command description.                    

` );
} );
