import { Command } from '../../lib/command.ts';
import { assertEquals, assertThrowsAsync } from '../lib/assert.ts';

const cmd = new Command()
    .throwErrors()
    .option( '-o, --optional [value...:number]', 'description ...' )
    .option( '-b, --boolean <value...:boolean>', 'description ...' )
    .option( '-s, --string <value...:string>', 'description ...' )
    .option( '-n, --number <value...:number>', 'description ...' )
    .option( '-v, --variadic-option <value:number> <value:string> [value...:boolean]', 'description ...' )
    .action( () => {} );

// Optional:

Deno.test( async function command_optionVariadic_optional() {

    const { options, args } = await cmd.parse( [ '-o' ] );

    assertEquals( options, { optional: true } );
    assertEquals( args, [] );
} );

// Boolean:

Deno.test( async function command_optionVariadic_boolean() {

    const { options, args } = await cmd.parse( [ '-b', '1', '0', 'true', 'false' ] );

    assertEquals( options, { boolean: [ true, false, true, false ] } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionVariadic_booleanInvalidValue() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-b', '1', '0', 'true', 'false', '2' ] );
    }, Error, 'Option --boolean must be of type boolean but got: 2' );
} );

// String:

Deno.test( async function command_optionVariadic_string() {

    const { options, args } = await cmd.parse( [ '-s', '1', '0', 'true', 'false' ] );

    assertEquals( options, { string: [ '1', '0', 'true', 'false' ] } );
    assertEquals( args, [] );
} );

// Number:

Deno.test( async function command_optionVariadic_number() {

    const { options, args } = await cmd.parse( [ '-n', '1', '0', '654', '1.2' ] );

    assertEquals( options, { number: [ 1, 0, 654, 1.2 ] } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionVariadic_numberInvalidValue() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-n', '1', '0', '654', 'abc', '1,2' ] );
    }, Error, 'Option --number must be of type number but got: abc' );
} );

// Exact:

Deno.test( async function command_optionVariadic_exact() {

    const { options, args } = await cmd.parse( [ '-v', '1', 'abc', '1' ] );

    assertEquals( options, { variadicOption: [ 1, 'abc', true ] } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionVariadic_exactInvalidValue() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-v', 'abc', 'abc', '1' ] );
    }, Error, 'Option --variadic-option must be of type number but got: abc' );
} );

Deno.test( async function command_optionVariadic_exactMissingValue() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-v', '1' ] );
    }, Error, 'Missing value for option: --variadic-option' );
} );

Deno.test( async function command_optionVariadic_exactLastOptional() {

    const { options, args } = await cmd.parse( [ '-v', '1', 'abc' ] );

    assertEquals( options, { variadicOption: [ 1, 'abc' ] } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionVariadic_exactLastOptionalVariadic() {

    const { options, args } = await cmd.parse( [ '-v', '1', 'abc', '1', '0', 'true', 'false' ] );

    assertEquals( options, { variadicOption: [ 1, 'abc', true, false, true, false ] } );
    assertEquals( args, [] );
} );

await Deno.runTests();
