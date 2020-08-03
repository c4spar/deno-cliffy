import { bold, red } from 'https://deno.land/std@0.63.0/fmt/colors.ts';
import { Number } from '../prompts/number.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( 'prompt number: value', async () => {
    console.log();
    Number.inject( '1' );
    const result: number | undefined = await Number.prompt( 'message' );
    assertEquals( result, 1 );
} );

Deno.test( 'prompt number: negative value', async () => {
    console.log();
    Number.inject( '-1' );
    const result: number | undefined = await Number.prompt( 'message' );
    assertEquals( result, -1 );
} );

Deno.test( 'prompt number: number value', async () => {
    console.log();
    Number.inject( '0' );
    const result: number | undefined = await Number.prompt( 'message' );
    assertEquals( result, 0 );
} );

Deno.test( 'prompt number: empty value', async () => {
    await assertThrowsAsync( async () => {
        Number.inject( '' );
        await Number.prompt( 'message' );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( 'prompt number: invalid value', async () => {
    await assertThrowsAsync( async () => {
        Number.inject( 'abc' );
        await Number.prompt( 'message' );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( 'prompt number: null value', async () => {
    await assertThrowsAsync( async () => {
        Number.inject( null as any );
        await Number.prompt( 'message' );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );
