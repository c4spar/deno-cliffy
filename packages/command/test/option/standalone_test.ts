import { Command } from '../../lib/command.ts';
import { assertEquals, assertThrowsAsync } from '../lib/assert.ts';

const cmd = new Command()
    .throwErrors()
    .option( '-f, --flag [value:boolean]', 'description ...', { standalone: true } )
    .option( '-a, --all [value:boolean]', 'description ...' )
    .action( () => {} );

Deno.test( 'command optionStandalone flag', async () => {

    const { options, args } = await cmd.parse( [ '-f' ] );

    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( 'command optionStandalone flagCombine', async () => {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', '-a' ] );
    }, Error, 'Option --flag cannot be combined with other options' );
} );

Deno.test( 'command optionStandalone flagCombineLong', async () => {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '--flag', '--all' ] );
    }, Error, 'Option --flag cannot be combined with other options' );
} );
