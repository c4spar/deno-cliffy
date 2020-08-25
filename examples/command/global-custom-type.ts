#!/usr/bin/env -S deno run

import { Command, ITypeInfo } from '../../command/mod.ts';

const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function emailType( { label, name, value }: ITypeInfo ): string {

    if ( !emailRegex.test( value.toLowerCase() ) ) {
        throw new Error( `${ label } ${ name } must be a valid email but got: ${ value }` );
    }

    return value;
}

await new Command()
    .type( 'email', emailType, { global: true } )

    .command( 'login', 'Login with email.' )
    .option( '-e, --email <email:email>', 'Your email address.' )
    .action( console.log )

    .command( 'config', 'Manage config.' )
    .option( '-a, --admin-email [email:email]', 'Get or set admin email address.' )
    .action( console.log )

    .parse( Deno.args );
