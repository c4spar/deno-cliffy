import { bold, red } from 'https://deno.land/std@v0.61.0/fmt/colors.ts';
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
    Input.inject( 'foo' );
    const result: string | undefined = await Input.prompt( {
        message: 'message',
        validate: value => value.length < 10
    } );
    assertEquals( result, 'foo' );
} );

Deno.test( 'prompt input: default value', async () => {
    console.log();
    Input.inject( '' );
    const result: string | undefined = await Input.prompt( {
        message: 'message',
        default: 'default',
        validate: value => value.length < 10
    } );
    assertEquals( result, 'default' );
} );

Deno.test( 'prompt input: empty value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Input.inject( '' );
        await Input.prompt( {
            message: 'message',
            minLength: 8
        } );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Value must be longer then 8 but has a length of 0.` ) );
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
