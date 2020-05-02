import { bold, red } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { Input } from '../prompts/input.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( async function prompt_input() {
    console.log();
    Input.inject( 'hallo' );
    const result: string | undefined = await Input.prompt( 'message' );
    assertEquals( result, 'hallo' );
} );

Deno.test( async function prompt_input_emptyValue() {
    console.log();
    await assertThrowsAsync( async () => {
        Input.inject( '' );
        await Input.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( async function prompt_input_option_validate() {
    console.log();
    Input.inject( 'a'.repeat( 9 ) );
    const result: string | undefined = await Input.prompt( {
        message: 'message',
        validate: value => value.length < 10
    } );
    assertEquals( result, 'a'.repeat( 9 ) );
} );

Deno.test( async function prompt_input_option_validateInvalid() {
    console.log();
    await assertThrowsAsync( async () => {
        Input.inject( 'a'.repeat( 10 ) );
        await Input.prompt( {
            message: 'message',
            validate: value => value.length < 10
        } );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( async function prompt_confirm_nullValue() {
    console.log();
    await assertThrowsAsync( async () => {
        Input.inject( null as any );
        await Input.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );
