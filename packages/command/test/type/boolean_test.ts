import { Command } from '../../../command/lib/command.ts';
import { assertEquals, assertThrowsAsync } from '../lib/assert.ts';

const cmd = new Command()
    .throwErrors()
    .option( '-f, --flag [value:boolean]', 'description ...' )
    .action( () => {} );

Deno.test( async function command_typeString_flag() {

    const { options, args } = await cmd.parse( [ '-f' ] );

    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( async function command_typeString_flagValue() {

    const { options, args } = await cmd.parse( [ '--flag' ] );

    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( async function command_typeString_flagValue() {

    const { options, args } = await cmd.parse( [ '-f', 'true' ] );

    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( async function command_typeString_flagValue() {

    const { options, args } = await cmd.parse( [ '--flag', 'true' ] );

    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( async function command_typeString_flagValue() {

    const { options, args } = await cmd.parse( [ '-f', 'false' ] );

    assertEquals( options, { flag: false } );
    assertEquals( args, [] );
} );

Deno.test( async function command_typeString_flagValue() {

    const { options, args } = await cmd.parse( [ '--flag', 'false' ] );

    assertEquals( options, { flag: false } );
    assertEquals( args, [] );
} );

Deno.test( async function command_typeString_flagValue() {

    const { options, args } = await cmd.parse( [ '-f', '1' ] );

    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( async function command_typeString_flagValue() {

    const { options, args } = await cmd.parse( [ '--flag', '1' ] );

    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( async function command_typeString_flagValue() {

    const { options, args } = await cmd.parse( [ '-f', '0' ] );

    assertEquals( options, { flag: false } );
    assertEquals( args, [] );
} );

Deno.test( async function command_typeString_flagValue() {

    const { options, args } = await cmd.parse( [ '--flag', '0' ] );

    assertEquals( options, { flag: false } );
    assertEquals( args, [] );
} );

Deno.test( async function command_typeString_flagValue() {

    const { options, args } = await cmd.parse( [ '--no-flag' ] );

    assertEquals( options, { flag: false } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionStandalone_flagCombineLong() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', 'true', 'unknown' ] );
    }, Error, 'Unknown command: unknown' );
} );

Deno.test( async function command_optionStandalone_flagCombineLong() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', 'unknown' ] );
    }, Error, 'Option --flag must be of type boolean but got: unknown' );
} );
