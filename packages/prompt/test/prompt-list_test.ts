import { inject, prompt } from '../lib/prompt.ts';
import { Checkbox } from '../prompts/checkbox.ts';
import { Confirm } from '../prompts/confirm.ts';
import { Number } from '../prompts/number.ts';
import { assertEquals } from './lib/assert.ts';

Deno.test( 'prompt list', async () => {

    let beforeCalled: number = 0;
    let afterCalled: number = 0;
    const expectedResult = {
        animals: [ 'dog', 'snake' ],
        like: true,
        age: 99
    };
    const expectedLikeResult = {
        animals: [ 'dog', 'snake' ],
        like: true
    };

    inject( {
        animals: [ 'dog', 'snake' ],
        like: 'Yes',
        age: 99
    } );

    const result = await prompt( [ {
        name: 'animals',
        message: `Select some animal's`,
        type: Checkbox,
        options: [ 'dog', 'cat', 'snake' ]
    }, {
        name: 'like',
        message: 'Do you like it?',
        type: Confirm,
        after: async ( result, next ) => {
            afterCalled++;
            assertEquals( result, expectedLikeResult );
            await next();
        }
    }, {
        before: async ( result, next ) => {
            assertEquals( result, expectedLikeResult );
            beforeCalled++;
            await next();
        },
        name: 'age',
        message: 'How old are you?',
        type: Number
    }, {
        before: async ( result, _ ) => {
            assertEquals( result, expectedResult );
            /** skip unknown */
        },
        name: 'unknown',
        message: '...',
        type: Number
    } ] );

    assertEquals( result, expectedResult );
    assertEquals( beforeCalled, 1 );
    assertEquals( afterCalled, 1 );
} );
