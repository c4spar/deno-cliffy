import { bold, red } from 'https://deno.land/std@v0.62.0/fmt/colors.ts';
import { Select } from '../prompts/select.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( 'prompt select: value', async () => {
    console.log();
    Select.inject( 'value2' );
    const result: string | undefined = await Select.prompt( {
        message: 'message',
        options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
    } );
    assertEquals( result, 'value2' );
} );

Deno.test( 'prompt select: empty value', async () => {
    await assertThrowsAsync( async () => {
        Select.inject( '' );
        await Select.prompt( {
            message: 'message',
            options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
        } );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( 'prompt select: invalid value', async () => {
    await assertThrowsAsync( async () => {
        Select.inject( 'value4' );
        await Select.prompt( {
            message: 'message',
            options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
        } );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( 'prompt select: null value', async () => {
    await assertThrowsAsync( async () => {
        Select.inject( null as any );
        await Select.prompt( {
            message: 'message',
            options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
        } );
    }, Error, red( `${ Deno.build.os === 'windows' ? bold( ' × ' ) : bold( ' ✘ ' ) }Invalid answer.` ) );
} );
