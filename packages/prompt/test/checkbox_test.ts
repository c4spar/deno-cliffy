import { bold, red } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { Checkbox } from '../prompts/checkbox.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( async function prompt_checkbox() {
    console.log();
    Checkbox.inject( [ 'value1', 'value3' ] );
    const result: string[] | undefined = await Checkbox.prompt( {
        message: 'message',
        options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
    } );
    assertEquals( result, [ 'value1', 'value3' ] );
} );

Deno.test( async function prompt_checkbox_emptyValue() {
    console.log();
    Checkbox.inject( [] );
    const result: string[] | undefined = await Checkbox.prompt( {
        message: 'message',
        options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
    } );
    assertEquals( result, [] );
} );

Deno.test( async function prompt_checkbox_invalidValue() {
    console.log();
    await assertThrowsAsync( async () => {
        Checkbox.inject( [ 'value3', 'value4' ] );
        await Checkbox.prompt( {
            message: 'message',
            options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
        } );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( async function prompt_checkbox_nullValue() {
    console.log();
    await assertThrowsAsync( async () => {
        Checkbox.inject( null as any );
        await Checkbox.prompt( {
            message: 'message',
            options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
        } );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );
