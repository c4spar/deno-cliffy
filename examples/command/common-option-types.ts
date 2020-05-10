#!/usr/bin/env -S deno run

import { Command } from '../../packages/command/lib/command.ts';

const { options } = await new Command()
    // boolean with optional value
    .option( '-d, --debug', 'output extra debugging.' )
    // boolean with optional value
    .option( '-s, --small [small:boolean]', 'Small pizza size.' )
    // string with required value
    .option( '-p, --pizza-type <type>', 'Flavour of pizza.' )
    // string with required value
    .option( '-n, --notes <note:string>', 'Notes.' )
    // number with required value
    .option( '-a, --amount <amount:number>', 'Pieces of pizza.' )
    // parse arguments
    .parse( Deno.args );

if ( options.debug ) {
    console.log( options );
}

console.log( 'pizza details:' );

if ( options.small ) {
    console.log( '- small pizza size' );
}

if ( options.pizzaType ) {
    console.log( `- ${ options.pizzaType }` );
}

if ( options.amount ) {
    console.log( '- %s pieces', options.amount );
}

if ( options.notes ) {
    console.log( '- notes: %s', options.notes );
}
