import { Command } from '../../lib/command.ts';
import { assertEquals, assertThrowsAsync } from '../lib/assert.ts';

const cmd = new Command()
    .throwErrors()
    .allowEmpty( false )
    .option( '-f, --flag [value:string]', 'description ...', { required: true } )
    .action( () => {} );

Deno.test( async function command_optionRequired() {

    const { options, args } = await cmd.parse( [ '-f', 'value' ] );

    assertEquals( options, { flag: 'value' } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionRequired_noArguments() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [] );
    }, Error, 'Missing required option: --flag' );
} );

await Deno.runTests();
