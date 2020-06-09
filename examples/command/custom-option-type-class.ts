#!/usr/bin/env -S deno run

import { Command, Type } from '../../command.ts';
import { IFlagArgument, IFlagOptions } from '../../flags.ts';

class EmailType extends Type<string> {

    protected emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    public parse( option: IFlagOptions, arg: IFlagArgument, value: string ): string {

        if ( !this.emailRegex.test( value.toLowerCase() ) ) {
            throw new Error( `Option --${ option.name } must be a valid email but got: ${ value }` );
        }

        return value;
    }
}

const { options } = await new Command()
    .type( 'email', new EmailType() )
    .arguments( '[email:email]' )
    .option( '-e, --email <value:email>', 'Your email address.' )
    .command( 'email [email:email]' )
    .description( 'Your email address.' )
    .parse( Deno.args );

console.log( options );
