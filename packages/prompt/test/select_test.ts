import { bold, red } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { Select } from '../prompts/select.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( async function prompt_select() {
    console.log();
    Select.inject( 'value2' );
    const result: string | undefined = await Select.prompt( {
        message: 'message',
        options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
    } );
    assertEquals( result, 'value2' );
} );

Deno.test( async function prompt_select_emptyValue() {
    await assertThrowsAsync( async () => {
        Select.inject( '' );
        await Select.prompt( {
            message: 'message',
            options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
        } );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( async function prompt_select_invalidValue() {
    await assertThrowsAsync( async () => {
        Select.inject( 'value4' );
        await Select.prompt( {
            message: 'message',
            options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
        } );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( async function prompt_select_nullValue() {
    await assertThrowsAsync( async () => {
        Select.inject( null as any );
        await Select.prompt( {
            message: 'message',
            options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
        } );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );
