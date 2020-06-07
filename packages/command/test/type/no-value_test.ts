import { Command } from '../../../command/lib/command.ts';
import { assertEquals, assertThrowsAsync } from '../lib/assert.ts';

const cmd = new Command()
    .throwErrors()
    .option( '-f, --flag', 'description ...' )
    .action( () => {} );

Deno.test( 'command: types - no value short flag', async () => {
    const { options, args } = await cmd.parse( [ '-f' ] );
    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( 'command: types - no value long flag', async () => {
    const { options, args } = await cmd.parse( [ '--flag' ] );
    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( 'command: types - no value short flag invalid arg', async () => {
    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', 'true' ] );
    }, Error, 'Unknown command: true' );
} );

Deno.test( 'command: types - no value long flag invalid arg', async () => {
    await assertThrowsAsync( async () => {
        await cmd.parse( [ '--flag', 'true' ] );
    }, Error, 'Unknown command: true' );
} );
