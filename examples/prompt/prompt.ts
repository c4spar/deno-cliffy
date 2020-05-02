#!/usr/bin/env -S deno --allow-env

import { Checkbox, Confirm, Input, Number, Select, Separator } from '../../packages/prompt/mod.ts';

await Confirm.prompt( {
    message: 'Would you like to buy a pizza?'
} );

await Confirm.prompt( {
    message: 'Would you like to buy a pizza?',
    mode: 'legacy'
} );

await Input.prompt( {
    message: `What's your name?`
} );

await Number.prompt( {
    message: 'How old are you?'
} );

await Select.prompt( {
    message: 'Select your pizza?',
    values: [ 'margherita', 'caprese', new Separator( 'Special' ), 'diavola' ]
} );

await Checkbox.prompt( {
    message: `Du you like any extra's?`,
    values: [ 'mozzarella', 'olive', new Separator( 'Special' ), 'buffalo mozzarella' ]
} );
