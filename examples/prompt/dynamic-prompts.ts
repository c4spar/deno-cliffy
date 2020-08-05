#!/usr/bin/env -S deno run --unstable

import { prompt } from '../../packages/prompt/lib/prompt.ts';
import { Checkbox } from '../../packages/prompt/prompts/checkbox.ts';
import { Confirm } from '../../packages/prompt/prompts/confirm.ts';
import { Number } from '../../packages/prompt/prompts/number.ts';

const result = await prompt( [ {
    name: 'animals',
    message: `Select some animal's`,
    type: Checkbox,
    options: [ 'dog', 'cat', 'snake' ]
}, {
    name: 'like',
    message: `Do you like animal's?`,
    type: Confirm,
    after: async ( { like }, next ) => { // executed after like prompt
        if ( like ) {
            await next(); // run age prompt
        } else {
            await next( 'like' ); // run like prompt again
        }
    }
}, {
    name: 'age',
    message: 'How old are you?',
    type: Number,
    before: async ( { animals }, next ) => { // executed before age prompt
        if ( animals?.length === 3 ) {
            await next(); // run age prompt
        } else {
            await next( 'animals' ); // begin from start
        }
    }
} ] );

console.log( result );
