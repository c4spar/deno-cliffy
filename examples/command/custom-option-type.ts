#!/usr/bin/env -S deno run

import { Command } from '../../command/command.ts';
import { IFlagArgument, IFlagOptions } from '../../flags/types.ts';

const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function emailType( option: IFlagOptions, arg: IFlagArgument, value: string ): string {

    if ( !emailRegex.test( value.toLowerCase() ) ) {
        throw new Error( `Option --${ option.name } must be a valid email but got: ${ value }` );
    }

    return value;
}

const { options } = await new Command()
    .type( 'email', emailType )
    .arguments( '[email:email]' )
    .option( '-e, --email <value:email>', 'Your email address.' )
    .command( 'email [email:email]', 'Your email address.' )
    .parse( Deno.args );

console.log( options );
