import { bold, red } from 'https://deno.land/std@v0.42.0/fmt/colors.ts';
import { Confirm } from '../prompts/confirm.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( 'prompt confirm: y', async () => {
    console.log();
    Confirm.inject( 'y' );
    const result: boolean | undefined = await Confirm.prompt( 'message' );
    assertEquals( result, true );
} );

Deno.test( 'prompt confirm: yes', async () => {
    console.log();
    Confirm.inject( 'Yes' );
    const result: boolean | undefined = await Confirm.prompt( 'message' );
    assertEquals( result, true );
} );

Deno.test( 'prompt confirm: n', async () => {
    console.log();
    Confirm.inject( 'n' );
    const result: boolean | undefined = await Confirm.prompt( 'message' );
    assertEquals( result, false );
} );

Deno.test( 'prompt confirm: no', async () => {
    console.log();
    Confirm.inject( 'No' );
    const result: boolean | undefined = await Confirm.prompt( 'message' );
    assertEquals( result, false );
} );

Deno.test( 'prompt confirm: empty value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Confirm.inject( '' );
        await Confirm.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( 'prompt confirm: invalid value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Confirm.inject( 'noo' );
        await Confirm.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( 'prompt confirm: null value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Confirm.inject( null as any );
        await Confirm.prompt( 'message' );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );
