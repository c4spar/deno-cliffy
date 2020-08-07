#!/usr/bin/env -S deno run

import { Command } from '../../command/command.ts';

const { options } = await new Command()
    .option( '--sauce [sauce:boolean]', 'Remove sauce', { default: true } )
    .option( '--cheese [flavour:string]', 'cheese flavour', { default: 'mozzarella' } )
    .parse( Deno.args );

const sauceStr = options.sauce ? 'sauce' : 'no sauce';
const cheeseStr = ( options.cheese === false ) ? 'no cheese' : `${ options.cheese } cheese`;

console.log( `You ordered a pizza with ${ sauceStr } and ${ cheeseStr }` );
