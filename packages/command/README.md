<h1 align="center">Cliffy ❯ Command</h1>

<p align="center">
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Version" src="https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Release date" src="https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github&color=blue" />
  </a>
  <a href="https://deno.land/">
    <img alt="Deno version" src="https://img.shields.io/badge/deno-^1.0.0-blue?logo=deno" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Build status" src="https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/issues?q=is%3Aissue+is%3Aopen+label%3Amodule%3Acommand">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy/module:command?label=issues&logo=github">
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Licence" src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" />
  </a>
</p>

<p align="center">
  <b> The complete solution for <a href="https://deno.land/">Deno</a> command-line interfaces </b></br>
  <sub>>_ Create flexible command line interfaces with type checking, auto generated help and out of the box support for shell completions <sub>
</p>

### ✨ Features

* ⭐️ chainable ⭐️
* ⭐️ short and long flags ⭐️
* ⭐️ nested sub-commands ⭐️
* ⭐️ aliases ⭐️
* ⭐️ depending & conflicting options ⭐️
* ⭐️ negatable options ⭐️
* ⭐️ type checking ⭐️
* ⭐️ custom type's ⭐️
* ⭐️ custom value processing ⭐️
* ⭐️ custom error handling ⭐️
* ⭐️ git style sub commands ⭐️
* ⭐️ environment variable's validation ⭐️
* ⭐️ auto generated help ⭐️
* ⭐️ out of the box support for shell completion's ⭐️

### Table of content

- [Creating a program](#creating-a-program)
- [Options](#options)
  - [Common option types: boolean, number and string](#common-option-types-boolean-number-and-string)
  - [List option types](#list-option-types)
  - [Custom option types](#custom-option-types)
  - [Auto completion](#auto-completion)
  - [Variadic options](#variadic-options)
  - [Default option value](#default-option-value)
  - [Required options](#required-options)
  - [Negatable options](#negatable-options)
  - [Global options](#global-options)
  - [Options which depends on other options](#options-which-depends-on-other-options)
  - [Options which conflicts with other options](#options-which-conflicts-with-other-options)
  - [Custom option processing](#custom-option-processing)
  - [Standalone options](#standalone-options)
  - [Hidden options](#hidden-options)
  - [Specify an action for an option](#specify-an-action-for-an-option)
- [Commands](#commands)
  - [Action handler](#action-handler)
  - [Sub-commands](#sub-commands)
  - [Specify the argument syntax](#specify-the-argument-syntax)
  - [Global commands](#global-commands)
  - [Hidden commands](#hidden-commands)
  - [Stop early](#stop-early)
  - [Git-style executable sub-commands](#git-style-executable-sub-commands)
  - [Override exit handling](#override-exit-handling)
  - [Specify environment variables](#specify-the-argument-syntax)
  - [Specify examples](#specify-examples)
- [Generic options and arguments](#generic-options-and-arguments)
- [Default options & commands](#default-options--commands)
  - [Version option](#version-option)
  - [Help option & command](#help-option--command)
  - [Completions command](#completions-command)
- [License](#license)

## Creating a program

To create a program with cliffy you can import the `Command` class from the cliffy module https://deno.land/x/cliffy/mod.ts or directly from the command module https://deno.land/x/cliffy/command.ts.

The `Command` class is used to create a new command or sub-command.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .version( '0.1.0' )
    .description( 'Example description ...' )
    .parse( Deno.args );
```

```textile
$ ./examples/command/creating-a-program.ts help

  Usage:   creating-a-program.ts
  Version: v0.0.1

  Description:

    Example description ...

  Options:

    -h, --help     [arg:boolean]  - Show this help.
    -V, --version  [arg:boolean]  - Show the version number for this program.

  Commands:

    help         [command:string]  - Show this help.
    completions                    - Generate shell completions for zsh and bash.
```

## Options

Options are defined with the `.option()` method. Each option can have multiple short flag's (single character) and long name's, separated by a comma.

The options can be accessed as properties on the options object passed to the `.action()` handler and return by the `.parse()` method. Multi-word options such as `--template-engine` are camel-cased, becoming `options.templateEngine` etc. Multiple short flags may be combined as a single arg, for example `-abc` is equivalent to `-a -b -c`.


### Common option types: boolean, number and string

Each option can have multiple required and optional values. Required values are declared using angle brackets and optional values with square brackets. Each value can take a type and an action: `<name:type:action>`

There are three pre defined option types: `boolean`, `number` and `string`. An `boolean` value can be one of: `true`, `false`, `1` or `0`, a `number` can be any nummeric value and a `string` can be any value.

Type and action are both optional. The type defaults to `boolean` and the action to the type specific action. Action are used for shell completion and will be more explained in the [autocompletion](#autocompletion) section.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

const { options } = await new Command()
    // boolean with optional value
    .option( '-d, --debug', 'output extra debugging.' )
    // boolean with optional value
    .option( '-c, --cash [cash:boolean]', 'Pay with cash.' )
    // boolean with required value
    .option( '-s, --small <small:boolean>', 'Small pizza size.' )
    // string with required value
    .option( '-p, --pizza-type <type:string>', 'Flavour of pizza.' )
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
```

```
$ deno run https://deno.land/x/cliffy/examples/command/common-option-types.ts -d
{ debug: true }
pizza details:

$ deno run https://deno.land/x/cliffy/examples/command/common-option-types.ts -p
Error: Missing value for option: --pizza-type

$ deno run https://deno.land/x/cliffy/examples/command/common-option-types.ts -ds -p vegetarian
{ debug: true, small: true, pizzaType: "vegetarian" }
pizza details:
- small pizza size
- vegetarian

$ deno run https://deno.land/x/cliffy/examples/command/common-option-types.ts -d --pizza-type cheese --amount 2 --notes "notes ..."
{ debug: true, pizzaType: "cheese", amount: 2, notes: "notes ..." }
pizza details:
- cheese
- 2 pieces
- notes: notes ...
```

`cmd.parse(Deno.args)` processes the arguments, leaving any options consumed by the command in the `options` object and all arguments in the `args` array. For all unknown options the command will throw an error message and exit the program with `Deno.exit(1)`.

### List option types

Each type of option's can be a list of comma seperated items. The default seperator is a `,` and can be changed with the `separator` option.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

const { options } = await new Command()
    // comma separated list
    .option( '-l, --list <items:number[]>', 'comma separated list of numbers.' )
    // space separated list
    .option( '-o, --other-list <items:string[]>', 'space separated list of strings.', { separator: ' ' } )
    .parse( Deno.args );

console.log( options );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/list-option-type.ts -l 1,2,3
{ list: [ 1, 2, 3 ] }

$ deno run https://deno.land/x/cliffy/examples/command/list-option-type.ts -o "1 2 3"
{ otherList: [ "1", "2", "3" ] }
```


### Custom option types

You can register custom types with the `.type()` method. The first argument is the name of the type, the second can be either a function or an instance of `Type` and the third argument is an options object.

This example shows you how to use a function as type handler.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';
import { IFlagArgument, IFlagOptions, ITypeHandler } from 'https://deno.land/x/cliffy/flags.ts';

const email = (): ITypeHandler<string> => {

    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return ( option: IFlagOptions, arg: IFlagArgument, value: string | false ): string | undefined => {

        if ( value ) {
            if ( !emailRegex.test( value.toLowerCase() ) ) {
                throw new Error( `Option --${ option.name } must be a valid email but got: ${ value }` );
            }
        }

        return value || undefined;
    };
};

const { options } = await new Command()
    .type( 'email', email() )
    .option( '-e, --email <value:email>', 'Your email address.' )
    .parse( Deno.args );

console.log( options );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/custom-option-type.ts -e "my@email.de"
{ email: "my@email.de" }
```

```
$ deno run https://deno.land/x/cliffy/examples/command/custom-option-type.ts -e "my @email.de"
Option --email must be a valid email but got: my @email.de
```

This example shows you how to use a class as type handler.

```typescript
#!/usr/bin/env -S deno run

import { Command, Type } from 'https://deno.land/x/cliffy/command.ts';
import { IFlagArgument, IFlagOptions } from 'https://deno.land/x/cliffy/flags.ts';

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

await new Command()
    .option( '-e, --email <value:email>', 'Your email address.' )
    .type( 'email', new EmailType() )
    .parse( Deno.args );

```

```
$ deno run https://deno.land/x/cliffy/examples/command/custom-option-type-class.ts -e "my@email.de"
{ email: "my@email.de" }
```

```
$ deno run https://deno.land/x/cliffy/examples/command/custom-option-type-class.ts -e "my @email.de"
Option --email must be a valid email but got: my @email.de
```

To make an type available for child commands you can set the `global` option in the options argument.

```
await new Command()
    .type( 'email', email(), { global: true } )

    .command( 'login' )
    .description( 'Login with email.' )
    .option( '-e, --email <value:email>', 'Your email address.' )
    .action( console.log )

    .command( 'config' )
    .description( 'Manage config.' )
    .option( '-a, --admin-email [value:email]', 'Get or set admin email address.' )
    .action( console.log )

    .parse( Deno.args );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/global-custom-type.ts login --email "my@email.de"
{ email: "my@email.de" }
```

### Auto completion

Cliffy supports auto-completion out of the box for `zsh` and `bash`.

> At the moment only `zsh` is supported.

Some predefined types like `boolean` has predefined auto-completion. There are two ways to add auto-completion to types. One option is defining an action. An auto-completion action is declared with the `.complete()` method and can be used in the command arguments declaration and by any option. The action is added after the type separated by colon.

```typescript
import { Command, Type } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .arguments( '[value:string:email]' )
    .option( '-e, --email <value:string:email>', 'Your email address.' )
    .complete( 'email', () => [ 'aaa@example.com', 'bbb@example.com', 'ccc@example.com' ] )
    .parse( Deno.args );
```

Another way to add autocompletion is by creating a custom type class with a `.complete()` method.

```typescript
import { Command, StringType } from 'https://deno.land/x/cliffy/command.ts';

class EmailType extends StringType {

    complete(): string[] {
        return [ 'aaa@example.com', 'bbb@example.com', 'ccc@example.com' ];
    }
}

await new Command()
    .option( '-e, --email <value:email>', 'Your email address.' )
    .type( 'email', new EmailType() )
    .parse( Deno.args );
```

Enabling auto completion is explained in the [completions command](#completions-command) section.

### Variadic options

The last argument of an option can be variadic, and only the last argument. To make an argument variadic you append ... to the argument name. For example:

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .version( '0.1.0' )
    .option( '-d, --dir  [otherDirs...:string]' )
    .parse( Deno.args );

console.log( options );
```

The variadic option is returned as an array.

```
$ deno run https://deno.land/x/cliffy/examples/command/variadic-options.ts -d dir1 dir2 dir3
{ dir: [ "dir1", "dir2", "dir3" ] }
```

### Default option value

You can specify a default value for an option with an optional value.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

const { options } = new Command()
    .option( '-c, --cheese [type:string]', 'add the specified type of cheese', { default: 'blue' } )
    .parse( Deno.args );

console.log( `cheese: ${options.cheese}` );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/default-option-value.ts
cheese: blue

$ deno run https://deno.land/x/cliffy/examples/command/default-option-value.ts --cheese mozzarella
cheese: mozzarella
```

### Required options

You may specify a required (mandatory) option.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .allowEmpty( false )
    .option( '-c, --cheese [type:string]', 'pizza must have cheese', { required: true } )
    .parse( Deno.args );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/required-options.ts
Missing required option: --cheese
```

### Negatable options

You can call the long name from an option with a boolean or an optional value (declared using square brackets) with a leading `--no-` to set the option value to false when used.

You can specify a default value for the flag and it can be overridden on command line.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

const { options } = await new Command()
    .option( '--sauce [sauce:boolean]', 'Remove sauce', { default: true } )
    .option( '--cheese [flavour:string]', 'cheese flavour', { default: 'mozzarella' } )
    .parse( Deno.args );

const sauceStr = options.sauce ? 'sauce' : 'no sauce';
const cheeseStr = ( options.cheese === false ) ? 'no cheese' : `${ options.cheese } cheese`;

console.log( `You ordered a pizza with ${ sauceStr } and ${ cheeseStr }` );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/negatable-options.ts
You ordered a pizza with sauce and mozzarella cheese

$ deno run https://deno.land/x/cliffy/examples/command/negatable-options.ts  --cheese
You ordered a pizza with sauce and mozzarella cheese

$ deno run https://deno.land/x/cliffy/examples/command/negatable-options.ts  --sauce
You ordered a pizza with sauce and mozzarella cheese

$ deno run https://deno.land/x/cliffy/examples/command/negatable-options.ts --cheese blue
You ordered a pizza with sauce and blue cheese

$ deno run https://deno.land/x/cliffy/examples/command/negatable-options.ts --no-sauce --no-cheese
You ordered a pizza with no sauce and no cheese

$ deno run https://deno.land/x/cliffy/examples/command/negatable-options.ts --cheese parmesan
You ordered a pizza with sauce and parmesan cheese
```

### Global options

To share options with child commands you can use the `global` option.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .version( '0.1.0' )
    .option( '-l, --local [val:string]', 'Only available on this command.' )
    .option( '-g, --global [val:string]', 'Available on this and all nested child command\'s.', { global: true } )
    .action( console.log )

    .command( 'command1', new Command()
        .description( 'Some sub command.' )
        .action( console.log )

        .command( 'command2', new Command()
            .description( 'Some nested sub command.' )
            .action( console.log )
        )
    )
    .parse( Deno.args );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/global-options.ts command1 command2 -g test
{ global: "test" }
```

### Options which depends on other options

Some options can not be call without other options. You can specify depending options with the `depends` option.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

const { options } = await new Command()
    .option( '-a, --audio-codec <type:string>', 'description ...' )
    .option( '-v, --video-codec <type:string>', 'description ...', { depends: [ 'audio-codec' ] } )
    .parse( Deno.args );

console.log( options );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/depending-options.ts -a aac
{ audioCodec: "aac" }

$ deno run https://deno.land/x/cliffy/examples/command/depending-options.ts -v x265
Option --video-codec depends on option: --audio-codec

$ deno run https://deno.land/x/cliffy/examples/command/depending-options.ts -a aac -v x265
{ audioCodec: "aac", videoCodec: "x265" }
```

### Options which conflicts with other options

Sometimes some options can not be called together. You can specify conflicting options with the `conflicts` option.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

const { options } = await new Command()
    .option( '-f, --file <file:string>', 'read from file ...' )
    .option( '-i, --stdin [stdin:boolean]', 'read from stdin ...', { conflicts: [ 'file' ] } )
    .parse( Deno.args );

console.log( options );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/conflicting-options.ts -f file1
{ file: "file1" }

$ deno run https://deno.land/x/cliffy/examples/command/conflicting-options.ts -i
{ stdin: true }

$ deno run https://deno.land/x/cliffy/examples/command/conflicting-options.ts -f file1 -i
Error: Option --stdin conflicts with option: --file

$ deno run https://deno.land/x/cliffy/examples/command/conflicting-options.ts -if file1
Error: Option --stdin conflicts with option: --file
```

### Custom option processing

You may specify a function to do custom processing of option values. The callback function receives one parameter, the user specified parsed value (string|number|boolean) and it returns the new value for the option.

If collect is enabled the function receives as second parameter the previous value.

This allows you to coerce the option value to the desired type, or accumulate values, or do entirely custom processing.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

const { options } = await new Command()
    .option( '-o, --object <item:string>', 'map string to object', ( value: string ): { value: string } => {
        return { value };
    } )
    .option( '-C, --color <item:string>', 'collect colors', {
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
```

```
$ deno run https://deno.land/x/cliffy/examples/command/custom-option-processing.ts --object a
{ object: { value: "a" } }

$ deno run https://deno.land/x/cliffy/examples/command/custom-option-processing.ts --color blue \
                                                                                   --color yellow \
                                                                                   --color red
{ color: [ "blue", "yellow", "red" ] }
```

### Standalone options

Standalone options cannot be combine with any command and option. For example the `--help` and `--version` flag. You can achieve this with the `standalone` option.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .option( '-s, --standalone [value:boolean]', 'Some standalone option.', { standalone: true } )
    .option( '-o, --other [value:boolean]', 'Some other option.' )
    .parse( Deno.args );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/standalone-options.ts --standalone --other
Error: Option --standalone cannot be combined with other options.
```

### Hidden options

To exclude option's from the help and completion command's you can use the `hidden` option.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .option( '-H, --hidden [hidden:boolean]', 'Nobody knows about me!', { hidden: true } )
    .parse( Deno.args );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/hidden-options.ts -h
```

### Specify an action for an option

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .version( '0.1.0' )
    .option( '-i, --info [arg:boolean]', 'Print some info.', {
        standalone: true,
        action: () => {
            console.log( 'Some info' );
            Deno.exit( 0 );
        }
    } )
    .parse( Deno.args );

console.log('not executed');
```

```
$ deno run https://deno.land/x/cliffy/examples/command/action-options.ts -i
Some info
```

## Commands

### Action handler

The action handler is called when the command is executed. It gets passed an object with all options defined by the user and additional arguments which are passed to the command.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .command( 'rm <dir>' )
    .option( '-r, --recursive [recursive:boolean]', 'Remove recursively' )
    .action( ( { recursive }: IFlags, dir: string ) => {
        console.log( 'remove ' + dir + ( recursive ? ' recursively' : '' ) );
    } )
    .parse( Deno.args );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/action-handler.ts rm dir
remove dir

$ deno run https://deno.land/x/cliffy/examples/command/action-handler.ts rm dir -r
remove dir recursively
```

### Sub-commands

You can specify sub-commands using the `.command()` method. There are three ways these can be implemented:

* Using an action handler attached to the command.

* Passing an `Command` instance as second parameter to the `.command()` method.

* or as a separate executable file by passing the description as second argument to the `.command()` method.

In the first parameter to `.command()` you specify the command name and any command arguments. The arguments may be `<required>` or `[optional]`, and the last argument may also be variadic.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

// Sub-command implemented using action handler (description is supplied separately to `.command()`)
await new Command()
    .command( 'clone <source:string> [destination:string]' )
    .description( 'Clone a repository into a newly created directory.' )
    .action( ( source: string, destination: string ) => {
        console.log( 'clone command called' );
    } )
    .parse( Deno.args );

// Sub-command implemented using a command instance as second parameter.
await new Command()
    .command( 'clone', new Command()
    .arguments( '<source:string> [destination:string]' )
    .description( 'Clone a repository into a newly created directory.' )
    .action( ( source: string, destination: string ) => {
        console.log( 'clone command called' );
    } ) )
    .parse( Deno.args );

// Command implemented using separate executable file (description is passed as second parameter to `.command()`)
await new Command()
    .command( 'start <service>', 'Start named service.' )
    .command( 'stop [service]', 'Stop named service, or all if no name supplied.' )
    .parse( Deno.args );
```

### Specify the argument syntax

You can use `.arguments()` to specify the arguments for the top-level command and for sub-commands. For sub-commands they can also be included in the `.command()` call. Angled brackets (e.g. `<required>`) indicate required input and square brackets (e.g. `[optional]`) indicate optional input. A required input can not be defined after an optional input.

* `[name:type]` optional value.
* `<name:type>` required value.
* `[name...:type]` optional variadic values.
* `<name...:type>` optional variadic values with a minimum of one requried value.

The name can be any name. It is only printed in the help.

The type can be one of:

* `string`
* `boolean`
* `number`

or any [custom type](#custom-option-types).

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

const { options, args } = await new Command()
    .version( '0.1.0' )
    .arguments( '<cmd:string> [env:string] [dirs...:string]' )
    .parse( Deno.args );

console.log( 'command:', args[0] );
console.log( 'environment:', args[1] || "no environment given");
console.log( 'directories:', args[2] || "no directories given");
```

```
$ deno run https://deno.land/x/cliffy/examples/command/arguments-syntax.ts
Error: Missing argument(s): cmd
```

The last argument of a command can be variadic, and only the last argument. To make an argument variadic you append `...` to the argument name. The variadic argument is passed to the action handler as an array.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .version( '0.1.0' )
    .command( 'rmdir <dirs...:string>' )
    .action( ( options: IFlags, dirs: string[] ) => {
        dirs.forEach( ( dir: string ) => {
            console.log( 'rmdir %s', dir );
        } );
    } )
    .parse( Deno.args );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/arguments-syntax-variadic.ts rmdir dir1 dir2 dir3
rmdir dir1
rmdir dir2
rmdir dir3
```

### Global commands

To share commands with child commands you can use the `.global()` method.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .version( '0.1.0' )

    .command( 'global [val:string]' )
    .description( 'global ...' )
    .global()
    .action( console.log )

    .command( 'command1', new Command()
        .description( 'Some sub command.' )

        .command( 'command2', new Command()
            .description( 'Some nested sub command.' )
        )
    )
    .parse( Deno.args );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/global-commands.ts command1 command2 global test
{} test
```

```

### Hidden commands

To exclude commands's from the help and completion command's you can use the `.hidden()` method.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .command( 'top-secret', 'Nobody knows about me!' )
    .hidden()
    .parse( Deno.args );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/hidden-commands.ts -h
```

### Stop early

If enabled, all arguments starting from the first non option argument will be interpreted as raw argument.

```typescript
await new Command()
    .stopEarly() // <-- enable stop early
    .option( '-d, --debug-level <level:string>', '...' )
    .arguments( '[script:string] [...args:number]' )
    .action( ( options: any, script: string, args: string[] ) => {
        console.log( 'options:', options );
        console.log( 'script:', script );
        console.log( 'args:', args );
    } )
    .parse( Deno.args );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/stop-early.ts -d warning server -p 80
options: { debugLevel: "warning" }
script: server
args: [ "-p", "80" ]
```

### Git-style executable sub-commands

When `.command()` is invoked with a description argument, this tells cliffy that you're going to use separate executables for sub-commands, much like `git(1)` and other popular tools. Cliffy will search the executables in the directory of the entry script (like `./examples/pm`) with the name program-sub-command, like `pm-install`, `pm-search`. You can specify a custom name with the `executable` configuration option.

You handle the options for an executable (sub)command in the executable, and don't declare them at the top-level.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .version( '0.1.0' )
    .command( 'install [name]', 'install one or more packages' )
    .command( 'search [query]', 'search with optional query' )
    .command( 'update', 'update installed packages', { executable: 'myUpdateSubCommand' } )
    .command( 'list', 'list packages installed' )
    .parse( Deno.args );
```

### Override exit handling

By default cliffy calls `Deno.exit` when it detects errors. You can override this behaviour with the `.throwErrors()` method.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

try {
    await new Command()
        .throwErrors()
        .version( '0.1.0' )
        .option( '-p, --pizza-type <type>', 'Flavour of pizza.' )
        .parse( Deno.args );
} catch ( err ) {
    // custom processing...
    console.error( '[CUSTOM_ERROR]', err );
}
```

```textile
$ deno run https://deno.land/x/cliffy/examples/command/override-exit-handling.ts -t
[CUSTOM_ERROR] Error: Unknown option: -t
    at parseFlags (https://deno.land/x/cliffy/packages/flags/lib/flags.ts:82:27)
    at Command.parseFlags (https://deno.land/x/cliffy/packages/command/lib/base-command.ts:581:20)
    at Command.parse (https://deno.land/x/cliffy/packages/command/lib/base-command.ts:479:45)
    at https://deno.land/x/cliffy/examples/command/override-exit-handling.ts:11:10
    at <anonymous> (<anonymous>)
```

Make sure the executables have proper modes, like `755`.


### Environment variables

You can define environment variables for a command that are validated when the command is executed.
Environment variables are listed with the [help](#help-option-and-command) option and command.
An environment variable can be marked as `global` and `hidden`.
`hidden` variables are not listed in the help output and `global` variables are validated for
the command for which they are registered and for all nested child commands.

To allow deno to access environment variables you have to set the `--allow-env` flag.
At the moment its also required to set the `--unstable` flag because deno's permissions api is marked as unstable.

```typescript
#!/usr/bin/env -S deno run --allow-env --unstable

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .env( 'SOME_ENV_VAR=<value:number>', 'Description ...', { global: true, hidden: false } )
    .command( 'hello' )
    .description( 'world ...' )
    .parse( Deno.args );

console.log( Deno.env.get( 'SOME_ENV_VAR' ) );
```

```
$ SOME_ENV_VAR=1 deno run --allow-env --unstable https://deno.land/x/cliffy/examples/command/environment-variables.ts
1

$ SOME_ENV_VAR=abc deno run --allow-env --unstable https://deno.land/x/cliffy/examples/command/environment-variables.ts
Error: Environment variable 'SOME_ENV_VAR' must be of type number but got: abc
```

### Specify examples

You can add some examples for your command which will be printed with the [help](#help-option-and-command) option and command.

```typescript
#!/usr/bin/env -S deno run

import { red } from 'https://deno.land/std/fmt/colors.ts';
import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .examples( 'example name', `Description ...\n\n Can have mutliple lines and ${ red( 'colors' ) }.` )
    .parse( Deno.args );
```

```
$ deno run https://deno.land/x/cliffy/examples/command/examples.ts help

  Usage:   COMMAND
  Version: v

  Description:

    No description ...

  Options:

    -h, --help     [arg:boolean]  - Show this help.
    -V, --version  [arg:boolean]  - Show the version number for this program.

  Commands:

    help         [command:command]  - Show this help or the help of a sub-command.
    completions                     - Generate shell completions for zsh and bash.

  Examples:

    Example name:
                  Description ...

                  Can have mutliple lines and colors.
```

## Generic options and arguments

You can define an interface for your command options and a tuple for the command arguments.

Here's how to do that:

```typescript
#!/usr/bin/env -S deno run

import { Command, IParseResult } from 'https://deno.land/x/cliffy/command.ts';

type Arguments = [ string, string ];

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
```

## Default options & commands

Every instance of the `Command` class has some pre defenied options and sub-commands. If you don't need these pre defined option's and sub-command's you can use the `BaseCommand` class instedd of the `Command` class.

### Version option

The `--version` and `-V` option flag prints the version number defined with the `version()` method. The version number will also be printed within the output of the [help](#help-option-command) option and command.

```typescript
#!/usr/bin/env -S deno run

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .version( '0.1.0' )
    .parse( Deno.args );
```
```
$ deno run https://deno.land/x/cliffy/examples/command/version-options.ts -V
$ deno run https://deno.land/x/cliffy/examples/command/version-options.ts --version
0.0.1
```

### Help option & command

The help information is auto-generated based on the information you have defined on your program.

```typescript
#!/usr/bin/env -S deno run --allow-env

import { Command } from 'https://deno.land/x/cliffy/command.ts';

await new Command()
    .version( '0.1.0' )
    .description( 'Sample description ...' )
    .env( 'EXAMPLE_ENVIRONMENT_VARIABLE=<value:boolean>', 'Environment variable description ...' )
    .example( 'Some example', 'Example content ...\n\nSome more example content ...' )
    .parse( Deno.args );
```

The `--help` and `-h` option flag and also the `help` sub-command prints the auto generated help.

```
$ deno run https://deno.land/x/cliffy/examples/command/help-option-and-command.ts -h
$ deno run https://deno.land/x/cliffy/examples/command/help-option-and-command.ts --help
$ deno run https://deno.land/x/cliffy/examples/command/help-option-and-command.ts help

  Usage:   help-option-and-command.ts
  Version: v0.1.0

  Description:

    Sample description ...

  Options:

    -h, --help     [arg:boolean]  - Show this help.
    -V, --version  [arg:boolean]  - Show the version number for this program.

  Commands:

    help         [command:string]  - Show this help or the help of a sub-command.
    completions                    - Generate shell completions for zsh and bash.

  Environment variables:

    EXAMPLE_ENVIRONMENT_VARIABLE <value:boolean> - Environment variable description ...

  Examples:

    Some example:
                  Example content ...

                  Some more example content ...

```

The `help` sub-command excepts also a name of a sub-command as argument to show the help of the sub-command. But you can also use the help flag and command directly from the sub-command.

```
$ deno run https://deno.land/x/cliffy/examples/command/help-option-and-command.ts help completions
$ deno run https://deno.land/x/cliffy/examples/command/help-option-and-command.ts completions -h
$ deno run https://deno.land/x/cliffy/examples/command/help-option-and-command.ts completions --help
$ deno run https://deno.land/x/cliffy/examples/command/help-option-and-command.ts completions help

  Usage:   completions
  Version: v0.1.0

  Description:

    Generate shell completions for zsh and bash.

    Bash completions:

    To enable bash completions for this program add following line to your ~/.bashrc.

        source <(command-name completions bash)

    Zsh completions:

    To enable zsh completions for this program add following line to your ~/.zshrc.

        source <(command-name completions zsh)

  Options:

    -h, --help     [arg:boolean]  - Show this help.
    -V, --version  [arg:boolean]  - Show the version number for this program.

  Commands:

    help  [command:string]  - Show this help or the help of a sub-command.
    zsh                     - Generate zsh shell completions.
    bash                    - Generate bash shell completions.

```

### Completions command

The `completions` command prints an autogenerated completion script for bash and zsh shell.

To get autocompletion's to work you have to add following line to your `~/.bashrc` or `~/.zshrc` or what ever you use:

**Bash Completions**

> ~/.bashrc

```shell script
source <(command-name completions bash)
```

**Zsh Completions**

> ~/.zshrc

```shell script
source <(command-name completions zsh)
```

## License

[MIT](LICENSE)
