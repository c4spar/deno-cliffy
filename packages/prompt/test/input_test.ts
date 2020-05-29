import { bold, red } from 'https://deno.land/std@v0.52.0/fmt/colors.ts';
import { Input } from '../prompts/input.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( 'prompt input: value', async () => {
    console.log();
    Input.inject( 'hallo' );
    const result: string | undefined = await Input.prompt( 'message' );
    assertEquals( result, 'hallo' );
} );

Deno.test( 'prompt input: validate option', async () => {
    console.log();
    Input.inject( 'a'.repeat( 9 ) );
    const result: string | undefined = await Input.prompt( {
        message: 'message',
        validate: value => value.length < 10
    } );
    assertEquals( result, 'a'.repeat( 9 ) );
} );

Deno.test( 'prompt input: empty value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Input.inject( '' );
        await Input.prompt( 'message' );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( 'prompt input: invalid value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Input.inject( 'a'.repeat( 10 ) );
        await Input.prompt( {
            message: 'message',
            validate: value => value.length < 10
        } );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( 'prompt input: null value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Input.inject( null as any );
        await Input.prompt( 'message' );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );
