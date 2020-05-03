import { Command } from '../../lib/command.ts';
import { assertEquals, assertThrowsAsync } from '../lib/assert.ts';

const version = '1.0.0';
const description = 'Test description ...';

function command( states: any = {} ): Command {
    return new Command()
        .throwErrors()
        .version( version )
        .description( description )
        .arguments( '[command]' )
        .command( 'sub-command <input:string> <output:string>' )
        .option( '-f, --flag [value:string]', 'description ...', { required: true } )
        .action( () => { states.action1 = true; } )
        .command( 'sub-command2 <input:string> <output:string>', new Command()
            .description( description )
            .arguments( '[command]' )
            .action( () => { states.action2 = true; } )
            .command( 'sub-command3 <input:string> <output:string>' )
            .option( '-e, --eee [value:string]', 'description ...' )
            .action( () => { states.action3 = true; } ) );
}

Deno.test( 'command subCommand', async () => {

    const stats: any = {};
    const cmd: Command = command( stats );
    const { options, args } = await cmd.parse( [ 'sub-command', 'input-path', 'output-path' ] );

    assertEquals( options, {} );
    assertEquals( args[ 0 ], 'input-path' );
    assertEquals( args[ 1 ], 'output-path' );
    assertEquals( stats.action1, true );
    assertEquals( stats.action2, undefined );
    assertEquals( stats.action3, undefined );
} );

Deno.test( 'command subCommand2', async () => {

    const stats: any = {};
    const cmd: Command = command( stats );
    const { options, args } = await cmd.parse( [ 'sub-command2', 'input-path', 'output-path' ] );

    assertEquals( options, {} );
    assertEquals( args[ 0 ], 'input-path' );
    assertEquals( args[ 1 ], 'output-path' );
    assertEquals( stats.action1, undefined );
    assertEquals( stats.action2, true );
    assertEquals( stats.action3, undefined );
} );

Deno.test( 'command subCommand3', async () => {

    const stats: any = {};
    const cmd: Command = command( stats );
    const { options, args } = await cmd.parse( [ 'sub-command2', 'sub-command3', 'input-path', 'output-path' ] );

    assertEquals( options, {} );
    assertEquals( args[ 0 ], 'input-path' );
    assertEquals( args[ 1 ], 'output-path' );
    assertEquals( stats.action1, undefined );
    assertEquals( stats.action2, undefined );
    assertEquals( stats.action3, true );
} );

Deno.test( 'command subCommand typeString flagMissing', async () => {

    await assertThrowsAsync( async () => {
        await command().parse( [ 'sub-command', 'input-path' ] );
    }, Error, 'Missing argument: output' );
} );

Deno.test( 'command subCommand2 typeString flagMissing', async () => {

    await assertThrowsAsync( async () => {
        await command().parse( [ 'sub-command2', 'input-path' ] );
    }, Error, 'Missing argument: output' );
} );

Deno.test( 'command subCommand3 typeString flagMissing', async () => {

    await assertThrowsAsync( async () => {
        await command().parse( [ 'sub-command2', 'sub-command3', 'input-path' ] );
    }, Error, 'Missing argument: output' );
} );
