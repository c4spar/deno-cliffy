#!/usr/bin/env -S deno run --unstable

import { prompt } from '../../packages/prompt/lib/prompt.ts';
import { Checkbox } from '../../packages/prompt/prompts/checkbox.ts';
import { Confirm } from '../../packages/prompt/prompts/confirm.ts';
import { Input } from '../../packages/prompt/prompts/input.ts';
import { Number } from '../../packages/prompt/prompts/number.ts';

const result = await prompt( [ {
    name: 'name',
    message: `What's your name?`,
    type: Input
}, {
    name: 'age',
    message: 'How old are you?',
    type: Number
}, {
    name: 'like',
    message: `Do you like animal's?`,
    type: Confirm
}, {
    name: 'animals',
    message: `Select some animal's`,
    type: Checkbox,
    options: [ 'dog', 'cat', 'snake' ]
} ] );

console.log( result );

// if ( result.foo ) {} // error: Property 'foo' does not exist
// if ( result.name && isNaN( result.name ) ) {} // error: Argument of type 'string' is not assignable to parameter of type 'number'.
// if ( result.age && isNaN( result.age ) ) {} // no error: age is of type number
