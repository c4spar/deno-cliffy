import { Command } from '../../lib/command.ts';
import { assertEquals } from '../lib/assert.ts';

const cmd = new Command()
    .version( '0.1.0' )

    .command( 'global [val:string]' )
    .description( 'global ...' )
    .global()
    .action( console.log )

    .command( 'command1', new Command()
        .description( 'Some sub command.' )

        .command( 'command2', new Command()
            .description( 'Some nested sub command.' )
        )
    );

Deno.test( 'command with global command and global custom type', async () => {

    const { options, args } = await cmd.parse( [ 'global', 'halo' ] );

    assertEquals( options, {} );
    assertEquals( args, [ 'halo' ] );
} );

Deno.test( 'sub command with global command and global custom type', async () => {

    const { options, args } = await cmd.parse( [ 'command1', 'global', 'halo' ] );

    assertEquals( options, {} );
    assertEquals( args, [ 'halo' ] );
} );

Deno.test( 'nested sub command with global command and global custom type', async () => {

    const { options, args } = await cmd.parse( [ 'command1', 'command2', 'global', 'halo' ] );

    assertEquals( options, {} );
    assertEquals( args, [ 'halo' ] );
} );
