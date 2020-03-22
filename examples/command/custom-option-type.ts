#!/usr/bin/env -S deno --allow-env

import { Command } from '../../packages/command/lib/command.ts';
import { IFlagArgument, IFlagOptions, ITypeHandler } from '../../packages/flags/lib/types.ts';

const email = (): ITypeHandler<string> => {

    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return ( option: IFlagOptions, arg: IFlagArgument, value: string | false ): string | undefined => {

        if ( value ) {
            if ( !emailRegex.test( value.toLowerCase() ) ) {
                throw new Error( `Option --${ option.name } must be a valid email but got: ${ value }` );
            }
            return value;
        }
    };
};

// Register email as global type:
Command.type( 'email', email() );

const { options } = await new Command()
    // Register email as command specific type:
    .type( 'email', email() )
    .option( '-e, --email <value:email>', 'Your email address.', {
        // Register email as option specific type:
        // type: email()
    } )
    .parse( Deno.args );

console.log( options );
