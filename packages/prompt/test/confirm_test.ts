import { bold, red } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { Confirm } from '../prompts/confirm.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( async function prompt_confirm_y() {
    console.log();
    Confirm.inject( 'y' );
    const result: boolean | undefined = await Confirm.prompt( 'message' );
    assertEquals( result, true );
} );

Deno.test( async function prompt_confirm_yes() {
    console.log();
    Confirm.inject( 'Yes' );
    const result: boolean | undefined = await Confirm.prompt( 'message' );
    assertEquals( result, true );
} );

Deno.test( async function prompt_confirm_n() {
    console.log();
    Confirm.inject( 'n' );
    const result: boolean | undefined = await Confirm.prompt( 'message' );
    assertEquals( result, false );
} );

Deno.test( async function prompt_confirm_no() {
    console.log();
    Confirm.inject( 'No' );
    const result: boolean | undefined = await Confirm.prompt( 'message' );
    assertEquals( result, false );
} );

Deno.test( async function prompt_confirm_emptyValue() {
    console.log();
    await assertThrowsAsync( async () => {
        Confirm.inject( '' );
        await Confirm.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( async function prompt_confirm_invalidValue() {
    console.log();
    await assertThrowsAsync( async () => {
        Confirm.inject( 'noo' );
        await Confirm.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( async function prompt_confirm_nullValue() {
    console.log();
    await assertThrowsAsync( async () => {
        Confirm.inject( null as any );
        await Confirm.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );
