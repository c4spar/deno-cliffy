import { Command } from '../../lib/command.ts';
import { assertEquals, assertThrowsAsync } from '../lib/assert.ts';

const cmd = new Command()
    .throwErrors()
    .option( '-f, --flag, --fl, --flags [value:boolean]', 'description ...' )
    .action( () => {} );

Deno.test( async function command_optionAliases_f() {

    const { options, args } = await cmd.parse( [ '-f' ] );

    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionAliases_fl() {

    const { options, args } = await cmd.parse( [ '--fl' ] );

    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionAliases_flag() {

    const { options, args } = await cmd.parse( [ '--flag' ] );

    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionAliases_flags() {

    const { options, args } = await cmd.parse( [ '--flags' ] );

    assertEquals( options, { flag: true } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionAliases_fInvalidValie() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', 'value' ] );
    }, Error, 'Option --flag must be of type boolean but got: value' );
} );

Deno.test( async function command_optionAliases_flInvalidValue() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '--fl', 'value' ] );
    }, Error, 'Option --flag must be of type boolean but got: value' );
} );

Deno.test( async function command_optionAliases_flagInvalidValue() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '--flag', 'value' ] );
    }, Error, 'Option --flag must be of type boolean but got: value' );
} );

Deno.test( async function command_optionAliases_flagsInvalidValue() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '--flags', 'value' ] );
    }, Error, 'Option --flag must be of type boolean but got: value' );
} );

await Deno.runTests();
