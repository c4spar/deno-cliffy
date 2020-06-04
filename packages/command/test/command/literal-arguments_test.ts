import { Command } from '../../lib/command.ts';
import { assertEquals } from '../lib/assert.ts';

Deno.test( 'command literal arguments', async () => {

    const { options, args, literal } = await new Command()
        .throwErrors()
        .option( '-f, --flag [val:string]', '...' )
        .action( () => {} )
        .parse( [ '-f', 'value', '--', '-t', 'abc' ] );

    assertEquals( options, { flag: 'value' } );
    assertEquals( args, [] );
    assertEquals( literal, [ '-t', 'abc' ] );
} );
