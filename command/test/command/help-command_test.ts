import { assertEquals } from '../../../dev_deps.ts';
import { stripeColors } from '../../../table/utils.ts';
import { CompletionsCommand } from '../../completions/mod.ts';
import { HelpCommand } from '../../help/mod.ts';
import { Command } from '../../command.ts';

function command( defaultOptions?: boolean ) {
    const cmd = new Command()
        .throwErrors()
        .version( '1.0.0' )
        .description( 'Test description ...' );

    if ( defaultOptions === false ) {
        cmd.versionOption( false )
            .helpOption( false );
    }

    return cmd.option( '-t, --test [val:string]', 'test description' )
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
        .env( 'SOME_ENV_VAR=<value:number>', 'Description ...' )
        .env( 'SOME_ENV_VAR_2 <value>', 'Description 2 ...' )

        .command( 'help', new HelpCommand() )
        .command( 'completions', new CompletionsCommand() )

        .command( 'sub-command <input:string> <output:string>' )
        .description( 'sub command description.' )

        .command( 'hidden-command <input:string> <output:string>' )
        .description( 'Nobody knows about me!' )
        .hidden()

        .reset();
}

Deno.test( 'command: help command', async () => {

    const output: string = command().getHelp();

    assertEquals( `
  Usage:   COMMAND
  Version: v1.0.0 

  Description:

    Test description ...

  Options:

    -h, --help                     - Show this help.                                                                                        
    -V, --version                  - Show the version number for this program.                                                              
    -t, --test       [val:string]  - test description                                                                                       
    -D, --default    [val:string]  - I have a default value!                    (Default: test)                                             
    -r, --required   [val:string]  - I am required!                             (required)                                                  
    -d, --depends    [val:string]  - I depend on test!                          (depends: test)                                             
    -c, --conflicts  [val:string]  - I conflict with test!                      (conflicts: test)                                           
    -a, --all        <val:string>  - I have many hints!                         (required, Default: test, depends: test, conflicts: depends)

  Commands:

    help         [command:command]               - Show this help or the help of a sub-command.
    completions                                  - Generate shell completions.                 
    sub-command  <input:string> <output:string>  - sub command description.                    

  Environment variables:

    SOME_ENV_VAR    <value:number>  - Description ...  
    SOME_ENV_VAR_2  <value:string>  - Description 2 ...

`, stripeColors( output ) );
} );

Deno.test( 'command: help command', async () => {

    const output: string = command( false ).getHelp();

    assertEquals( `
  Usage:   COMMAND
  Version: v1.0.0 

  Description:

    Test description ...

  Options:

    -t, --test       [val:string]  - test description                                                                     
    -D, --default    [val:string]  - I have a default value!  (Default: test)                                             
    -r, --required   [val:string]  - I am required!           (required)                                                  
    -d, --depends    [val:string]  - I depend on test!        (depends: test)                                             
    -c, --conflicts  [val:string]  - I conflict with test!    (conflicts: test)                                           
    -a, --all        <val:string>  - I have many hints!       (required, Default: test, depends: test, conflicts: depends)

  Commands:

    help         [command:command]               - Show this help or the help of a sub-command.
    completions                                  - Generate shell completions.                 
    sub-command  <input:string> <output:string>  - sub command description.                    

  Environment variables:

    SOME_ENV_VAR    <value:number>  - Description ...  
    SOME_ENV_VAR_2  <value:string>  - Description 2 ...

`, stripeColors( output ) );
} );
