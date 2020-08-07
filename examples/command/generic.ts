#!/usr/bin/env -S deno run

import { Command } from '../../command/command.ts';
import { IParseResult } from '../../command/types.ts';

// define your argument types
type Arguments = [ string, string ];

// define your option types
interface Options {
    name: string;
    age: number;
    email?: string;
}

const result: IParseResult<Options, Arguments> = await new Command<Options, Arguments>()
    .version( '0.1.0' )
    .arguments( '<input:string> [output:string]' )
    .option( '-n, --name <name:string>', 'description ...', { required: true } )
    .option( '-a, --age <age:number>', 'description ...', { required: true } )
    .option( '-e, --email <email:string>', 'description ...' )
    .action( ( options: Options, input: string, output?: string ) => {} )
    .parse( Deno.args );

const options: Options = result.options;
const input: string = result.args[ 0 ];
const output: string | undefined = result.args[ 1 ];
