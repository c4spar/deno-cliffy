#!/usr/bin/env -S deno

import { Command, Type } from '../../command.ts';
import { IFlagArgument, IFlagOptions } from '../../flags.ts';

class EmailType extends Type<string> {

    protected emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    parse( option: IFlagOptions, arg: IFlagArgument, value: string | false ): string | undefined {

        if ( value ) {
            if ( !this.emailRegex.test( value.toLowerCase() ) ) {
                throw new Error( `Option --${ option.name } must be a valid email but got: ${ value }` );
            }
        }

        return value || undefined;
    }
}

const { options } = await new Command()
    .option( '-e, --email <value:email>', 'Your email address.' )
    .type( 'email', new EmailType() )
    .parse( Deno.args );

console.log( options );
