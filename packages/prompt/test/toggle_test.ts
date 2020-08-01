import { bold, red } from 'https://deno.land/std@v0.63.0/fmt/colors.ts';
import { Toggle } from '../prompts/toggle.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( 'prompt toggle: yes', async () => {
    console.log();
    Toggle.inject( 'Yes' );
    const result: boolean | undefined = await Toggle.prompt( 'message' );
    assertEquals( result, true );
} );

Deno.test( 'prompt toggle: no', async () => {
    console.log();
    Toggle.inject( 'No' );
    const result: boolean | undefined = await Toggle.prompt( 'message' );
    assertEquals( result, false );
} );

Deno.test( 'prompt toggle: empty value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Toggle.inject( '' );
        await Toggle.prompt( 'message' );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( 'prompt toggle: invalid value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Toggle.inject( 'aaa' );
        await Toggle.prompt( 'message' );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( 'prompt toggle: null value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Toggle.inject( null as any );
        await Toggle.prompt( 'message' );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );
