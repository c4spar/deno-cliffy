#!/usr/bin/env -S deno --allow-env

import { Command } from '../../packages/command/lib/command.ts';

const { options } = await new Command()
    .option( '-f, --float <value:number>', 'float argument' )
    .option( '-i, --integer <value:number>', 'integer argument' )
    .option( '-v, --variadic <value...:string>', 'repeatable value' )
    .option( '-l, --list <items:string[]>', 'comma separated list' )
    .option( '-o, --object <item:string>', 'map string to object', ( value: string ): { value: string } => {
        return { value };
    } )
    .option( '-C, --color <item:string>', 'map string to object', {
        collect: true,
        value: ( value: string, previous: string[] = [] ): string[] => {

            if ( [ 'blue', 'yellow', 'red' ].indexOf( value ) === -1 ) {
                throw new Error( `Color must be one of blue, yellow or red but got: ${ value }` );
            }

            previous.push( value );

            return previous;
        }
    } )
    .parse( Deno.args );

console.log( options );
