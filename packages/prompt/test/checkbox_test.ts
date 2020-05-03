import { bold, red } from 'https://deno.land/std@v0.42.0/fmt/colors.ts';
import { Checkbox } from '../prompts/checkbox.ts';
import { assertEquals, assertThrowsAsync } from './lib/assert.ts';

Deno.test( 'prompt checkbox: valid value', async () => {
    console.log();
    Checkbox.inject( [ 'value1', 'value3' ] );
    const result: string[] | undefined = await Checkbox.prompt( {
        message: 'message',
        options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
    } );
    assertEquals( result, [ 'value1', 'value3' ] );
} );

Deno.test( 'prompt checkbox: empty value', async () => {
    console.log();
    Checkbox.inject( [] );
    const result: string[] | undefined = await Checkbox.prompt( {
        message: 'message',
        options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
    } );
    assertEquals( result, [] );
} );

Deno.test( 'prompt checkbox: invalid value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Checkbox.inject( [ 'value3', 'value4' ] );
        await Checkbox.prompt( {
            message: 'message',
            options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
        } );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );

Deno.test( 'prompt checkbox: null value', async () => {
    console.log();
    await assertThrowsAsync( async () => {
        Checkbox.inject( null as any );
        await Checkbox.prompt( {
            message: 'message',
            options: [ { value: 'value1' }, { value: 'value2' }, 'value3' ]
        } );
    }, Error, red( `${ bold( ' ✘ ' ) }Invalid answer.` ) );
} );
