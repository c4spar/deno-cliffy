import { Command } from '../../lib/command.ts';
import { assertEquals, assertThrowsAsync } from '../lib/assert.ts';

const version = '1.0.0';
const description = 'Test description ...';

const cmd = new Command()
    .throwErrors()
    .version( version )
    .description( description )
    .arguments( '[command]' )
    .command( 'sub-command <input:string> <output:string>' )
    .option( '-f, --flag [value:string]', 'description ...', { required: true } )
    .action( () => {} );

Deno.test( async function command_subCommand() {

    const { options, args } = await cmd.parse( [ 'sub-command', 'input-path', 'output-path' ] );

    assertEquals( options, {} );
    assertEquals( args[ 0 ], 'input-path' );
    assertEquals( args[ 1 ], 'output-path' );
} );

Deno.test( async function command_subCommand_typeString_flagMissing() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ 'sub-command', 'input-path' ] );
    }, Error, 'Missing argument: output' );
} );

await Deno.runTests();
