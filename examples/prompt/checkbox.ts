#!/usr/bin/env -S deno run --unstable

import { Checkbox } from '../../prompt/mod.ts';

const colors: string[] = await Checkbox.prompt( {
    message: `Pick a color`,
    options: [
        { name: 'Red', value: '#ff0000' },
        { name: 'Green', value: '#00ff00', disabled: true },
        { name: 'Blue', value: '#0000ff' },
        Checkbox.separator( '--------' ),
        { name: 'White', value: '#ffffff' },
        { name: 'Black', value: '#000000' }
    ]
} );

console.log( { colors } );
