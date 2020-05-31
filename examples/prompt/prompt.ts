#!/usr/bin/env -S deno run --unstable

import { Checkbox, Confirm, Input, Number, Secret, Select, Toggle } from '../../packages/prompt/mod.ts';

await Confirm.prompt( {
    message: 'Would you like to buy a pizza?'
} );

await Toggle.prompt( {
    message: 'Would you like to buy a pizza?'
} );

await Input.prompt( {
    message: `What's your name?`
} );

await Number.prompt( {
    message: 'How old are you?'
} );

await Secret.prompt( {
    message: 'Enter your password',
    hidden: false
} );

await Select.prompt( {
    message: 'Select your pizza?',
    options: [ 'margherita', 'caprese', Select.separator( 'Special' ), 'diavola' ]
} );

await Checkbox.prompt( {
    message: `Du you like any extra's?`,
    options: [ 'mozzarella', 'olive', Checkbox.separator( 'Special' ), 'buffalo mozzarella' ]
} );
