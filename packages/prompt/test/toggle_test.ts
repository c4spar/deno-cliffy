import { bold, red } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { Toggle } from '../prompts/toggle.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( async function prompt_toggle_yes() {
    console.log();
    Toggle.inject( 'Yes' );
    const result: boolean | undefined = await Toggle.prompt( 'message' );
    assertEquals( result, true );
} );

Deno.test( async function prompt_toggle_no() {
    console.log();
    Toggle.inject( 'No' );
    const result: boolean | undefined = await Toggle.prompt( 'message' );
    assertEquals( result, false );
} );

Deno.test( async function prompt_toggle_emptyValue() {
    console.log();
    await assertThrowsAsync( async () => {
        Toggle.inject( '' );
        await Toggle.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( async function prompt_toggle_invalidValue() {
    console.log();
    await assertThrowsAsync( async () => {
        Toggle.inject( 'aaa' );
        await Toggle.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( async function prompt_toggle_nullValue() {
    console.log();
    await assertThrowsAsync( async () => {
        Toggle.inject( null as any );
        await Toggle.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );
