#!/usr/bin/env -S deno run

import { Command, Type } from '../../command/mod.ts';
import { ITypeInfo } from '../../flags/types.ts';

class EmailType extends Type<string> {

    protected emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    public parse( { label, name, value }: ITypeInfo ): string {

        if ( !this.emailRegex.test( value.toLowerCase() ) ) {
            throw new Error( `${ label } ${ name } must be a valid email but got: ${ value }` );
        }

        return value;
    }
}

const { options } = await new Command()
    .type( 'email', new EmailType() )
    .arguments( '[email:email]' )
    .option( '-e, --email <value:email>', 'Your email address.' )
    .command( 'email [email:email]', 'Your email address.' )
    .parse( Deno.args );

console.log( options );
