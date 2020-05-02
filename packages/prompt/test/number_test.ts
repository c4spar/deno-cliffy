import { bold, red } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { Number } from '../prompts/number.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( async function prompt_number() {
    console.log();
    Number.inject( '1' );
    const result: number | undefined = await Number.prompt( 'message' );
    assertEquals( result, 1 );
} );

Deno.test( async function prompt_number_negateValue() {
    console.log();
    Number.inject( '-1' );
    const result: number | undefined = await Number.prompt( 'message' );
    assertEquals( result, -1 );
} );

Deno.test( async function prompt_number_zeroValue() {
    console.log();
    Number.inject( '0' );
    const result: number | undefined = await Number.prompt( 'message' );
    assertEquals( result, 0 );
} );

Deno.test( async function prompt_number_emptyValue() {
    await assertThrowsAsync( async () => {
        Number.inject( '' );
        await Number.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( async function prompt_number_invalidValue() {
    await assertThrowsAsync( async () => {
        Number.inject( 'abc' );
        await Number.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( async function prompt_number_nullValue() {
    await assertThrowsAsync( async () => {
        Number.inject( null as any );
        await Number.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );
