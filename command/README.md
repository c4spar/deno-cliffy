<h1 align="center">Cliffy ❯ Command</h1>

<p align="center" class="badges-container">
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Version" src="https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github&color=blue" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions/workflows/test.yml">
    <img alt="Build status" src="https://github.com/c4spar/deno-cliffy/workflows/Test/badge.svg?branch=main" />
  </a>
  <a href="https://codecov.io/gh/c4spar/deno-cliffy">
    <img src="https://codecov.io/gh/c4spar/deno-cliffy/branch/main/graph/badge.svg"/>
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/labels/module%3Acommand">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy/module:command?label=issues&logo=github&color=yellow">
  </a>
  <a href="https://deno.land/">
    <img alt="Deno version" src="https://img.shields.io/badge/deno-^1.4.0-blue?logo=deno" />
  </a>
  <a href="https://doc.deno.land/https/deno.land/x/cliffy/command/mod.ts">
    <img alt="doc" src="https://img.shields.io/badge/deno-doc-yellow?logo=deno" />
  </a>
  <a href="https://discord.gg/ghFYyP53jb">
    <img alt="Discord" src="https://img.shields.io/badge/join-chat-blue?logo=discord&logoColor=white" />
  </a>
  <a href="../LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" />
  </a>
  <br>
  <a href="https://deno.land/x/cliffy">
    <img alt="Discord" src="https://img.shields.io/badge/Published on deno.land-blue?logo=deno&logoColor=959DA6&color=272727" />
  </a>
  <a href="https://nest.land/package/cliffy">
    <img src="https://nest.land/badge.svg" alt="nest.land badge">
  </a>
</p>

<p align="center">
  <b> The complete & type safe solution for <a href="https://deno.land/">Deno</a> command-line interfaces </b></br>
  <sub>Automatically typed options and arguments - input validation - auto generated help - build-in shell completions - and more.</sub>
</p>

<p align="center">
  <img alt="prompt" src="assets/img/demo.gif"/>
</p>

## ❯ Content

- [Install](#-install)
- [Usage](#-usage)
- [Options](#-options)
  - [Common option types: boolean, string, number and
    integer](#common-option-types-boolean-string-number-and-integer)
  - [Enum option type](#enum-option-type)
  - [List option types](#list-option-types)
  - [Variadic options](#variadic-options)
  - [Dotted options](#dotted-options)
  - [Default option value](#default-option-value)
  - [Required options](#required-options)
  - [Negatable options](#negatable-options)
  - [Global options](#global-options)
  - [Hidden options](#hidden-options)
  - [Standalone options](#standalone-options)
  - [Conflicting options](#conflicting-options)
  - [Depending options](#depending-options)
  - [Collect options](#collect-options)
  - [Custom option processing](#custom-option-processing)
  - [Option action handler](#option-action-handler)
- [Commands](#-commands)
  - [Name](#name)
  - [Description](#description)
  - [Arguments](#arguments)
  - [Usage](#usage)
  - [Action handler](#action-handler)
  - [Executable sub-commands](#executable-sub-commands)
  - [Global commands](#global-commands)
  - [Hidden commands](#hidden-commands)
  - [Stop early](#stop-early)
  - [Error and exit handling](#error-and-exit-handling)
- [Custom types](#-custom-types)
  - [Function types](#function-types)
  - [Class types](#class-types)
  - [Global types](#global-types)
- [Environment variables](#-environment-variables)
- [Add examples](#-add-examples)
- [Auto generated help](#-auto-generated-help)
  - [Additional info](#additional-info)
  - [Customize help](#customize-help)
  - [Help option](#help-option)
  - [Help command](#help-command)
- [Did you mean](#-did-you-mean)
- [Shell completion](#-shell-completion)
  - [Completions command](#completions-command)
    - [Bash Completions](#bash-completions)
    - [Fish Completions](#fish-completions)
    - [Zsh Completions](#zsh-completions)
- [Generic types](#-generic-types)
  - [Generic parent types](#generic-parent-types)
- [Upgrade command](#-upgrade-command)
- [Version option](#-version-option)
- [Contributing](#-contributing)
- [License](#-license)

## ❯ Install

This module can be imported directly from the repo and from following
registries.

Deno Registry

```typescript
import { Command } from "https://deno.land/x/cliffy@<version>/command/mod.ts";
```

Nest Registry

```typescript
import { Command } from "https://x.nest.land/cliffy@<version>/command/mod.ts";
```

Github

```typescript
import { Command } from "https://raw.githubusercontent.com/c4spar/deno-cliffy/<version>/command/mod.ts";
```

## ❯ Usage

To create a program with cliffy you can import the `Command` class from the main
module `https://deno.land/x/cliffy/command/mod.ts` or directly from the command
module `https://deno.land/x/cliffy/command/command.ts`.

The `Command` class is used to create a new command or sub-command. The main
command has two predefined options, a global `--help` option which is available
on all child commands and a `--version` option which is only available on the
main command.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .name("cliffy")
  .version("0.1.0")
  .description("Command line framework for Deno")
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/usage.ts --help
```

![](assets/img/usage.gif)

## ❯ Options

Options are defined with the `.option()` method and can be accessed as
properties on the options object which is passed to the `.action()` handler and
returned by the `.parse()` method.

As first parameter of the `.options()` method you define the option names and
arguments. Each option can have multiple short and long flag's, separated by
comma. Multi-word options such as `--template-engine` are camel-cased, becoming
`options.templateEngine` and multiple short flags may be combined as a single
arg, for example `-abc` is equivalent to `-a -b -c` and `-n5` is equivalent to
`-n 5` and `-n=5`.

An option can have multiple required and optional arguments, separated by space.
Required values are declared using angle brackets `<>` and optional values with
square brackets `[]`.

The second parameter of the `.options()` method is the help description and the
third parameter can be an options object.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option("-s, --silent", "disable output.")
  .option("-d, --debug [level]", "output extra debugging.")
  .option("-p, --port <port>", "the port number.")
  .option("-h, --host [hostname]", "the host name.", { default: "localhost" })
  .option("-a, --allow [hostname]", "the host name.", { default: "localhost" })
  .parse(Deno.args);

console.log("server running at %s:%s", options.host, options.port);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/options.ts -p 80
server running at localhost:80
```

The `.parse()` method processes all arguments, leaving any options consumed by
the command in the `options` object, all arguments in the `args` array and all
literal arguments in the `literal` array. For all unknown options the command
will throw an error message and exit the program with `Deno.exit(1)`.

All types and names for options, arguments and environemnt variables are
automatically infered and properly typed!

### Common option types: boolean, string, number and integer

Optionally you can declare a type after the argument name, separated by colon
`<name:type>`. If no type is specified, the type defaults to `string`. Following
types are available per default (_more will be added_):

- **boolean:** Can be one of: `true`, `false`, `1` or `0`.

- **string:** Can be any value.

- **number:** Can be any numeric value.

- **integer:** Can be any integer value.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  // optional boolean value
  .option("-s, --small [small:boolean]", "Small pizza size.")
  // required string value
  .option("-p, --pizza-type <type>", "Flavour of pizza.")
  // required number value
  .option("-a, --amount <amount:integer>", "Pieces of pizza.")
  .parse(Deno.args);

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/common_option_types.ts -p
Error: Missing value for option "--pizza-type".

$ deno run https://deno.land/x/cliffy/examples/command/common_option_types.ts -sp vegetarian --amount 3
{ small: true, pizzaType: "vegetarian", amount: 3 }
```

### Enum option type

The `EnumType` can be used to define a list of allowed values.

The constructor accapts eather an `Array<string | number>` or an `enum`.

The values are used for input validation and shell completions and displayed in
the help text.

The types will be automatically infered and applied to the values of the command
options and arguments.

```typescript
import { Command, EnumType } from "https://deno.land/x/cliffy/command/mod.ts";

enum Animal {
  Dog = "dog",
  Cat = "cat",
}

// Enum type with array
const color = new EnumType(["blue", "yellow", "red"]);

// Enum type with enum
const animal = new EnumType(Animal);

await new Command()
  .type("color", color)
  .type("animal", animal)
  .option(
    "-c, --color [name:color]",
    "Choose a color.",
  )
  .option(
    "-a, --animal [name:animal]",
    "Choose an animal.",
  )
  .action(({ color, animal }) => {
    console.log("color: %s", color);
    console.log("animal: %s", animal);
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/enum_option_type.ts --color red --animal dog
color: red
animal: dog

$ deno run https://deno.land/x/cliffy/examples/command/enum_option_type.ts --color foo
error: Option "--color" must be of type "color", but got "foo". Expected values: "blue", "yellow", "red"
```

### List option types

Each type of option's can be a list of comma separated items. The default
separator is a `,` and can be changed with the `separator` option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  // comma separated list
  .option("-l, --list <items:number[]>", "comma separated list of numbers.")
  // space separated list
  .option(
    "-o, --other-list <items:string[]>",
    "space separated list of strings.",
    { separator: " " },
  )
  .parse(Deno.args);

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/list_option_type.ts -l 1,2,3
{ list: [ 1, 2, 3 ] }

$ deno run https://deno.land/x/cliffy/examples/command/list_option_type.ts -o "1 2 3"
{ otherList: [ "1", "2", "3" ] }
```

### Variadic options

The last argument of an option can be variadic, and only the last argument. To
make an argument variadic you append ... to the argument name. For example:

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .version("0.1.0")
  .option("-d, --dir [otherDirs...:string]", "Variadic option.")
  .parse(Deno.args);

console.log(options);
```

The variadic option is returned as an array.

```console
$ deno run https://deno.land/x/cliffy/examples/command/variadic_options.ts -d dir1 dir2 dir3
{ dir: [ "dir1", "dir2", "dir3" ] }
```

### Dotted options

Dotted options allows you to group your options together in nested objects.
There is no limit for the level of nested objects.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option(
    "-b.a, --bitrate.audio, --audio-bitrate <bitrate:number>",
    "Audio bitrate",
  )
  .option(
    "-b.v, --bitrate.video, --video-bitrate <bitrate:number>",
    "Video bitrate",
  )
  .parse();

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/dotted_options.ts -b.a 300 -b.v 900
{ bitrate: { audio: 300, video: 900 } }

$ deno run https://deno.land/x/cliffy/examples/command/dotted_options.ts --bitrate.audio 300 --bitrate.video 900
{ bitrate: { audio: 300, video: 900 } }

$ deno run https://deno.land/x/cliffy/examples/command/dotted_options.ts --audio-bitrate 300 --video-bitrate 900
{ bitrate: { audio: 300, video: 900 } }
```

### Default option value

You can specify a default value for an option with an optional value.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option("-c, --cheese [type:string]", "add the specified type of cheese", {
    default: "blue",
  })
  .parse(Deno.args);

console.log(`cheese: ${options.cheese}`);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/default_option_value.ts
cheese: blue

$ deno run https://deno.land/x/cliffy/examples/command/default_option_value.ts --cheese mozzarella
cheese: mozzarella
```

### Required options

You may specify a required (mandatory) option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .allowEmpty(false)
  .option("-c, --cheese [type:string]", "pizza must have cheese", {
    required: true,
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/required_options.ts
Error: Missing required option "--cheese".
```

### Negatable options

You can specify a boolean option long name with a leading `no-` to set the
option value to false when used. Defined alone this also makes the option true
by default.

If you define `--foo`, adding `--no-foo` does not change the default value from
what it would otherwise be.

You can specify a default value for a flag and it can be overridden on command
line.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  // default value will be automatically set to true if no --check option exists
  .option("--no-check", "No check.")
  .option("--color <color:string>", "Color name.", { default: "yellow" })
  .option("--no-color", "No color.")
  // no default value
  .option("--remote <url:string>", "Remote url.")
  .option("--no-remote", "No remote.")
  .parse(Deno.args);

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/negatable_options.ts
{ check: true, color: "yellow" }

$ deno run https://deno.land/x/cliffy/examples/command/negatable_options.ts --no-check --no-color --no-remote
{ check: false, color: false, remote: false }
```

### Global options

To share options with child commands you can use the `global` option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .option("-l, --local [val:string]", "Only available on this command.")
  .option(
    "-g, --global [val:string]",
    "Available on this and all nested child command's.",
    { global: true },
  )
  .action(console.log)
  .command(
    "command1",
    new Command()
      .description("Some sub command.")
      .action(console.log)
      .command(
        "command2",
        new Command()
          .description("Some nested sub command.")
          .action(console.log),
      ),
  )
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/global_options.ts command1 command2 -g test
{ global: "test" }
```

### Hidden options

To exclude option's from the help and completion command's you can use the
`hidden` option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .option("-H, --hidden [hidden:boolean]", "Nobody knows about me!", {
    hidden: true,
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/hidden_options.ts -h
```

### Standalone options

Standalone options cannot be combine with any command and option. For example
the `--help` and `--version` flag. You can achieve this with the `standalone`
option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .option("-s, --standalone [value:boolean]", "Some standalone option.", {
    standalone: true,
  })
  .option("-o, --other [value:boolean]", "Some other option.")
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/standalone_options.ts --standalone --other
Error: Option --standalone cannot be combined with other options.
```

### Conflicting options

To define options which conflicts with other options you can use the `conflicts`
option by defining an array with the names of these options.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option("-f, --file <file:string>", "read from file ...")
  .option("-i, --stdin [stdin:boolean]", "read from stdin ...", {
    conflicts: ["file"],
  })
  .parse(Deno.args);

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/conflicting_options.ts -f file1
{ file: "file1" }

$ deno run https://deno.land/x/cliffy/examples/command/conflicting_options.ts -i
{ stdin: true }

$ deno run https://deno.land/x/cliffy/examples/command/conflicting_options.ts -if file1
Error: Option --stdin conflicts with option: --file
```

### Depending options

To define options which depends on other options you can use the `depends`
option by defining an array with the names of these options.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option("-u, --audio-codec <type:string>", "description ...")
  .option("-p, --video-codec <type:string>", "description ...", {
    depends: ["audio-codec"],
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/depending_options.ts -a aac
{ audioCodec: "aac" }

$ deno run https://deno.land/x/cliffy/examples/command/depending_options.ts -v x265
Error: Option "--video-codec" depends on option "--audio-codec".

$ deno run https://deno.land/x/cliffy/examples/command/depending_options.ts -a aac -v x265
{ audioCodec: "aac", videoCodec: "x265" }
```

### Collect options

An option can occur multiple times in the command line to collect multiple
values. Todo this, you have to activate the `collect` option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option("-c, --color <color:string>", "read from file ...", { collect: true })
  .parse(Deno.args);

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/collect_options.ts --color yellow --color red --color blue
{ color: [ "yellow", "red", "blue" ] }
```

### Custom option processing

You may specify a function to do custom processing of option values. The
callback function receives one parameter, the user specified value which is
already parsed into the target type, and it returns the new value for the
option.

If collect is enabled the function receives as second parameter the previous
value.

This allows you to coerce the option value to the desired type, or accumulate
values, or do entirely custom processing.

```typescript
import {
  Command,
  ValidationError,
} from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option(
    "-o, --object <item:string>",
    "map string to object",
    (value: string): { value: string } => {
      return { value };
    },
  )
  .option("-C, --color <item:string>", "collect colors", {
    collect: true,
    value: (value: string, previous: string[] = []): string[] => {
      if (["blue", "yellow", "red"].indexOf(value) === -1) {
        throw new ValidationError(
          `Color must be one of "blue, yellow or red", but got "${value}".`,
          // optional you can set the exitCode which is used if .throwErrors()
          // is not called. Default is: 1
          { exitCode: 1 },
        );
      }
      previous.push(value);
      return previous;
    },
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/custom_option_processing.ts --object a
{ object: { value: "a" } }

$ deno run https://deno.land/x/cliffy/examples/command/custom_option_processing.ts --color blue \
                                                                                   --color yellow \
                                                                                   --color red
{ color: [ "blue", "yellow", "red" ] }
```

### Option action handler

Options can have an action handler same as commands by passing the `action`
option to the `.option()` method.

**Prior to v0.20.0**, when an option action was executed, the command action was
not executed. **Since v0.20.0**, this has changed. The command action is now
executed by default. Only standalone options do not execute the command actions.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .version("0.1.0")
  .option("--foo", "Foo option.", {
    action: () => {
      console.log("--foo action");
    },
  })
  .option("--bar", "Bar option.", {
    standalone: true,
    action: () => {
      console.log("--bar action");
    },
  })
  .option("--baz", "Baz option.", {
    action: () => {
      console.log("--baz action");
      Deno.exit(0);
    },
  })
  .action(() => console.log("main action"))
  .parse(Deno.args);

console.log("main context");
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/action_options.ts --foo
--foo action
main action
main context
$ deno run https://deno.land/x/cliffy/examples/command/action_options.ts --bar
--bar action
main context
$ deno run https://deno.land/x/cliffy/examples/command/action_options.ts --baz
--baz action
```

## ❯ Commands

The command class is a factory class and has an internal command pointer that
points to the command instance itself by default. Each time the `.command()`
method is called, the internal pointer points to the newly created command. All
methods like `.name()`, `.description()`, `.option()`, `.action()`, etc...
always act on the command the pointer points to. If you need to change the
pointer back to the command instance, you can call the `.reset()` method.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .description("Main command.")
  .option("-a", "Main command option.")
  .command("command1 <file|dir>")
  .description("Command1 description.")
  .option("-b", "Command1 option.")
  .command("command2", new Command())
  .description("Command2 description.")
  .option("-c", "Command2 option.")
  .reset() // reset command pointer
  .option("-e", "Second main command option.")
  .parse(Deno.args);
```

There are three ways to specify sub-commands with the `.command()` method:

- Using an action handler attached to the command.
- Passing an `Command` instance as second argument to the `.command()` method.
- or by calling the `.executable()` method to execute a separate executable
  file.

In the first parameter to `.command()` you specify the command name and any
command arguments. The arguments may be `<required>` or `[optional]` and the
last argument may also be variadic. The second argument of the `.command()`
method is optional and can be either the command description or an instance of a
`Command` class. The description can be also defined with the `.description()`
method.

Sub-command implemented using the `.command()` method with an action handler.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command(
    "clone <source:string> [destination:string]",
    "Clone a repository into a newly created directory.",
  )
  .action((options: any, source: string, destination: string) => {
    console.log("clone command called");
  })
  .parse(Deno.args);
```

Sub-command implemented using a `Command` instance.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const clone = new Command()
  .arguments("<source:string> [destination:string]")
  .description("Clone a repository into a newly created directory.")
  .action((options: any, source: string, destination: string) => {
    console.log("clone command called");
  });

await new Command()
  .command("clone", clone)
  .parse(Deno.args);
```

Sub-command implemented using a separate executable file.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("start <service>", "Start named service.")
  .executable()
  .command(
    "stop [service]",
    new Command()
      .description("Stop named service, or all if no name supplied.")
      .executable(),
  )
  .parse(Deno.args);
```

### Name

With the `.name()` you can define the name of the command. In case of the main
command it must be the same as the program name. It is displayed in the auto
generated help and used for shell completions.

### Description

The `.description()` method adds a description for the command that will be
displayed in the auto generated help.

### Usage

With the `.usage()` method you can override the usage text that is displayed at
the top of the auto generated help which defaults to the command arguments.

### Arguments

You can use the `.arguments()` method to specify the arguments for the top-level
and for sub-commands. Angled brackets (e.g. `<required>`) indicate required
input and square brackets (e.g. `[optional]`) indicate optional input. A
required input cannot be defined after an optional input.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { args } = await new Command()
  .arguments("<cmd> [env]")
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/arguments_syntax.ts
Error: Missing argument(s): cmd
```

The last argument of a command can be variadic, and only the last argument. To
make an argument variadic you can append or perpend `...` to the argument name.
The variadic argument is passed to the action handler as an array.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("rmdir <dirs...:string>", "Remove directories.")
  .action((_, dirs: string[]) => {
    dirs.forEach((dir: string) => {
      console.log("rmdir %s", dir);
    });
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/arguments_syntax_variadic.ts rmdir dir1 dir2 dir3  
rmdir dir1  
rmdir dir2  
rmdir dir3
```

You can also use types for arguments same as for options and environment
variables. Custom types are also supported.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("rmdir <dir:string>")
  .action((options: any, dir: string) => {
    console.log("rmdir %s", dir);
  })
  .parse(Deno.args);
```

### Action handler

The action handler is called when the command is executed. It gets passed an
object with all options defined by the user and additional arguments which are
passed to the command.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("rm <dir>", "Remove directory.")
  .option("-r, --recursive [recursive:boolean]", "Remove recursively")
  .action(({ recursive }: any, dir: string) => {
    console.log("remove " + dir + (recursive ? " recursively" : ""));
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/action_handler.ts rm dir
remove dir

$ deno run https://deno.land/x/cliffy/examples/command/action_handler.ts rm dir -r
remove dir recursively
```

### Executable sub-commands

> Work in progress

When `.executable()` is invoked on a sub-command, this tells cliffy you're going
to use a separate executable file for the sub-command. Cliffy will look for a
globally installed program with the name program-sub-command, like
`deno-install`, `deno-upgrade`.

You handle the options for an executable (sub)command in the executable, and
don't declare them at the top-level.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("install [name]", "install one or more packages").executable()
  .command("search [query]", "search with optional query").executable()
  .command("update", "update installed packages").executable()
  .command("list", "list packages installed").executable()
  .parse(Deno.args);
```

### Global commands

To share commands with child commands you can use the `.global()` method.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("global [val:string]", "global ...")
  .global()
  .action(console.log)
  .command(
    "command1",
    new Command()
      .description("Some sub command.")
      .command(
        "command2",
        new Command()
          .description("Some nested sub command."),
      ),
  )
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/global_commands.ts command1 command2 global test
{} test
```

### Hidden commands

To exclude commands's from the help and completion command's you can use the
`.hidden()` method.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("top-secret", "Nobody knows about me!")
  .hidden()
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/hidden_commands.ts -h
```

### Stop early

If enabled, all arguments starting from the first non option argument will be
interpreted as raw argument.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .stopEarly() // <-- enable stop early
  .option("-d, --debug-level <level:string>", "Debug level.")
  .arguments("[script:string] [...args:string]")
  .action((options: any, script: string, args: string[]) => {
    console.log("options:", options);
    console.log("script:", script);
    console.log("args:", args);
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/stop_early.ts -d warning server -p 80
options: { debugLevel: "warning" }
script: server
args: [ "-p", "80" ]
```

### Error and exit handling

By default, cliffy prints the help text and calls `Deno.exit` when a
`ValidationError` is thrown. You can override this behaviour with the
`.throwErrors()` method. All other errors will be thrown by default.

The `.noExit()` method does the same as `.throwErrors()` but also prevents the
command from calling `Deno.exit` when the help or version option is called.

**Catch runtime errors**

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const cmd = new Command()
  .option("-p, --pizza-type <type>", "Flavour of pizza.")
  .action(() => {
    throw new Error("Some error happened.");
  });

try {
  cmd.parse();
} catch (error) {
  console.error("[CUSTOM_ERROR]", error);
  Deno.exit(1);
}
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/general_error_handling.ts -t
Unknown option "-t". Did you mean option "-h"?
$ deno run https://deno.land/x/cliffy/examples/command/general_error_handling.ts
[CUSTOM_ERROR] Some error happened.
```

**Catch validation errors**

```typescript
import {
  Command,
  ValidationError,
} from "https://deno.land/x/cliffy/command/mod.ts";

const cmd = new Command()
  .throwErrors() // <-- throw also validation errors.
  .option("-p, --pizza-type <type>", "Flavour of pizza.")
  .action(() => {
    throw new Error("Some error happened.");
  });

try {
  cmd.parse();
} catch (error) {
  if (error instanceof ValidationError) {
    cmd.showHelp();
    console.error("[CUSTOM_VALIDATION_ERROR]", error.message);
  } else {
    console.error("[CUSTOM_ERROR]", error);
  }
  Deno.exit(1);
}
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/validation_error_handling.ts -t
[CUSTOM_VALIDATION_ERROR] Unknown option "-t". Did you mean option "-h"?
```

## ❯ Custom types

You can register custom types with the `.type()` method. The first argument is
the name of the type, the second can be either a function or an instance of
`Type` and the third argument can be an options object.

### Function types

This example shows you how to use a function as type handler.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";
import { ITypeInfo } from "https://deno.land/x/cliffy/flags/mod.ts";

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function emailType({ label, name, value }: ITypeInfo): string {
  if (!emailRegex.test(value.toLowerCase())) {
    throw new Error(
      `${label} "${name}" must be a valid "email", but got "${value}".`,
    );
  }

  return value;
}

const { options } = await new Command()
  .type("email", emailType)
  .arguments("[email:email]")
  .option("-e, --email <value:email>", "Your email address.")
  .command("email [email:email]", "Your email address.")
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/custom_option_type.ts -e "my@email.com"
{ email: "my@email.com" }
$ deno run https://deno.land/x/cliffy/examples/command/custom_option_type.ts -e "my @email.com"
Error: Option "--email" must be a valid "email", but got "my @email.com".
```

### Class types

This example shows you how to use a class as type handler.

```typescript
import { Command, Type } from "https://deno.land/x/cliffy/command/mod.ts";
import { ITypeInfo } from "https://deno.land/x/cliffy/flags/mod.ts";

class EmailType extends Type<string> {
  protected emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  public parse({ label, name, value }: ITypeInfo): string {
    if (!this.emailRegex.test(value.toLowerCase())) {
      throw new Error(
        `${label} "${name}" must be a valid "email", but got "${value}".`,
      );
    }

    return value;
  }
}

const { options } = await new Command()
  .type("email", new EmailType())
  .arguments("[email:email]")
  .option("-e, --email <value:email>", "Your email address.")
  .command("email [email:email]", "Your email address.")
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/custom_option_type_class.ts -e "my@email.de"
{ email: "my@email.de" }
$ deno run https://deno.land/x/cliffy/examples/command/custom_option_type_class.ts -e "my @email.de"
Error: Option "--email" must be a valid "email", but got "my @email.de".
```

### Global types

To make an type available for child commands you can set the `global` option in
the options argument.

```typescript
await new Command()
  .type("email", new EmailType(), { global: true })
  .command("login", "Login with email.")
  .option("-e, --email <email:email>", "Your email address.")
  .action(console.log)
  .command("config", "Manage config.")
  .option("-a, --admin-email [email:email]", "Get or set admin email address.")
  .action(console.log)
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/global_custom_type.ts login --email "my@email.de"
{ email: "my@email.de" }
```

## ❯ Environment variables

Environment variables can be defined with the `.env()` method. Environment
variables are parsed and validated when the command is executed and stored in
the options object. They are also shown in the generated
[help](#help-option-and-command).

Environment variable names will be camel cased. For example `SOME_ENV_VAR=true`
will be parsed to `{ someEnvVar: true }`. If an option with the same name is
defined, the option will override the environment variable.

An environment variable has the following options:

- **global:** Also available on child commands.
- **hidden:** Not listed in the help output.
- **required:** Throws an error if the environment variable is not defined.
- **prefix:** Trim prefix from environment variable and use result as property
  name.

> To allow deno to access environment variables the `--allow-env` flag is
> required.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command<void>()
  .env(
    "SOME_ENV_VAR=<value:number>",
    "Description ...",
    {
      global: true,
      required: true,
    },
  )
  .action((options) => console.log(options))
  .command("hello", "world ...")
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/environment_variables.ts
error: Missing required environment variable "SOME_ENV_VAR".

$ SOME_ENV_VAR=abc deno run --allow-env --unstable https://deno.land/x/cliffy/examples/command/environment_variables.ts
Error: Environment variable "SOME_ENV_VAR" must be of type "number", but got "abc".

$ SOME_ENV_VAR=1 deno run --allow-env https://deno.land/x/cliffy/examples/command/environment_variables.ts
{ someEnvVar: 1 }
```

It is also possible to override an environment variable with an option also if
the environment variable has a prefix.

```typescript
await new Command<void>()
  .env(
    "FOO_OUTPUT_FILE=<value:string>",
    "The output file.",
    { prefix: "FOO_" },
  )
  .option(
    "--output-file <value:string>",
    "The output file.",
  )
  .action((options) => console.log(options))
  .parse();
```

```console
$ FOO_OUTPUT_FILE=example.txt deno run --allow-env https://deno.land/x/cliffy/examples/command/environment_variables_override.ts
{ outputFile: "example.txt" }
$ FOO_OUTPUT_FILE=example.txt deno run --allow-env https://deno.land/x/cliffy/examples/command/environment_variables_override.ts --output-file example2.txt
{ outputFile: "example2.txt" }
```

## ❯ Add examples

You can add some examples for your command which will be printed with the
[help](#help-option-and-command) option and command.

```typescript
import { red } from "https://deno.land/std/fmt/colors.ts";
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .name("examples")
  .example(
    "example name",
    `Description ...\n\nCan have multiple lines and ${red("colors")}.`,
  )
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/examples.ts help
```

![](assets/img/examples.gif)

## ❯ Auto generated help

The help information is auto-generated based on the information you have defined
on your command's. The main command has a global help option (`-h, --help`)
defined by default which prints the help text to stdout. You can also output or
retrieve the help text programmatically by using the `.showHelp()` or
`.getHelp()` method.

By default, only the first line of each option and command description is
printed. With the long help flag (`--help`) the full description is printed for
each option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/command.ts";
import { CompletionsCommand } from "https://deno.land/x/cliffy/command/completions/mod.ts";
import { HelpCommand } from "https://deno.land/x/cliffy/command/help/mod.ts";

await new Command()
  .name("help-option-and-command")
  .version("0.1.0")
  .description("Sample description ...")
  .env(
    "EXAMPLE_ENVIRONMENT_VARIABLE=<value:boolean>",
    "Environment variable description ...",
  )
  .example(
    "Some example",
    "Example content ...\n\nSome more example content ...",
  )
  .command("help", new HelpCommand())
  .command("completions", new CompletionsCommand())
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/help_option_and_command.ts --help
```

![](assets/img/help.gif)

### Additional info

You can add some additional information to the help text with the
`.meta(name, value)` method.

```ts
new Command()
  .name("example")
  .version("1.0.0")
  .description("Example command.")
  .meta("deno", Deno.version.deno)
  .meta("v8", Deno.version.v8)
  .meta("typescript", Deno.version.typescript)
  .parse();
```

The additional information is displayed below the command version.

```console
  Usage:   example
  Version: 0.1.0

  deno: 1.16.1
  v8: 9.7.106.2
  typescript: 4.4.2

  Description:

    Example command.
```

### Customize help

Customize default help with the `.help()` method.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/command.ts";

await new Command()
  .help({
    // Show argument types.
    types: true, // default: false
    // Show hints.
    hints: true, // default: true
    // Enable/disable colors.
    colors: false, // default: true
  })
  .option("-f, --foo [val:number]", "Some description.", {
    required: true,
    default: 2,
  })
  .parse();
```

You can also use the `.help()` method to override the help output. This
overrides the output of the `.getHelp()` and `.showHelp()` method's which are
used by the help option and command by default. The help handler will be used
for each command, but can be overridden in child commands.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/command.ts";

await new Command()
  .help("My custom help")
  // Can be also a function.
  .help(() => "My custom help")
  .parse();
```

### Help option

The `--help` and `-h` option flag prints the auto generated help.

#### Customize help option

The help option is completely customizable with the `.helpOption()` method. The
first argument is a string with the flags followed by the description. The third
argument can be an action handler or an options object. The second and third
arguments are optional.

```typescript
await new Command()
  .helpOption("-i, --info", "Print help info.", function (this: Command) {
    console.log("some help info ...", this.getHelp());
  })
  .parse(Deno.args);
```

You can also override the default options of the help option. The options are
the same as for the `.option()` method.

```typescript
await new Command()
  .helpOption(" -x, --xhelp", "Print help info.", { global: true })
  .parse(Deno.args);
```

To disable the help option you can pass false to the `.helpOption()` method.

```typescript
await new Command()
  .helpOption(false)
  .parse(Deno.args);
```

### Help command

There is also a predefined `HelpCommand` which prints the auto generated help.
The help command must be registered manually and can be optionally registered as
global command to make them also available on all child commands.

```typescript
import {
  Command,
  HelpCommand,
} from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .version("0.1.0")
  .description("Sample description ...")
  .env(
    "EXAMPLE_ENVIRONMENT_VARIABLE=<value:boolean>",
    "Environment variable description ...",
  )
  .command("help", new HelpCommand().global())
  .parse(Deno.args);
```

The `help` command excepts the name of a sub-command as optional argument to
show the help of the given sub-command.

```console
$ deno run https://deno.land/x/cliffy/examples/command/help_option_and_command.ts help
$ deno run https://deno.land/x/cliffy/examples/command/help_option_and_command.ts help completions
$ deno run https://deno.land/x/cliffy/examples/command/help_option_and_command.ts completions help
```

## ❯ Did you mean

Cliffy has build-in _did-you-mean_ support to improve the user and developer
experience. For example, cliffy prints some suggestions, when the user executes
an invalid command, or the developer has a typo in the name of a type.

```console
$ deno run https://deno.land/x/cliffy/examples/command/demo.ts -g
error: Unknown option "-g". Did you mean option "-h"?
```

## ❯ Shell completion

Cliffy supports shell completion out of the box.

**Currently supported shells**

- bash
- fish
- zsh

There are two ways to add auto-completion to types. One option is adding a
completion action. A completion action is declared with the `.complete()` method
and can be used in the command arguments declaration and by any option. The
action is added after the type separated by colon.

```typescript
import { Command, Type } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .complete("email", () => ["aaa@example.com", "bbb@example.com"])
  .arguments("[value:string:email]")
  .option("-e, --email <value:string:email>", "Your email address.")
  .parse(Deno.args);
```

Another way to add shell completion is by creating a custom type class with a
`.complete()` method.

```typescript
import { Command, StringType } from "https://deno.land/x/cliffy/command/mod.ts";

class EmailType extends StringType {
  complete(): string[] {
    return ["aaa@example.com", "bbb@example.com", "ccc@example.com"];
  }
}

await new Command()
  .type("email", new EmailType())
  .option("-e, --email <value:email>", "Your email address.")
  .parse(Deno.args);
```

Enabling auto completion is explained in the
[completions command](#completions-command) section.

### Completions command

The `CompetionsCommand` command generates the shell completions script for your
program. To do so, you have to register the completions command on your program.

```typescript
import {
  Command,
  CompletionsCommand,
} from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("completions", new CompletionsCommand())
  .parse(Deno.args);
```

By calling `command-name completions <shell>`, the command will output the
completions script to the stdout.

#### Bash Completions

To enable bash completions for your program add the following line to your
`~/.bashrc`:

```shell
source <(command-name completions bash)
```

#### Fish Completions

To enable fish completions for your program add the following line to your
`~/.config/fish/config.fish`:

```shell script
source (command-name completions fish | psub)
```

#### Zsh Completions

To enable zsh completions for your program add the following line to your
`~/.zshrc`:

```shell script
source <(command-name completions zsh)
```

## ❯ Generic types

Since `v0.21.0`, cliffy has strict types by default. All types, option and
environment-variable names will be automatically magically infered 🪄. **It is no
longer recommanded to define the types manuelly with the generic parameters**.
The only exceptions is when you want to organize your sub commands in separate
files, than you can use the first two generic constructor parameters which are
used do define required global options and types.

### Generic parent types

If you want to organize your sub commands into different files, you can define
required global parent options and types in the constructor of the child
command.

The first parameter defines required global options and/or environment
variables. The second parameter defines required global custom types.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const colorType = new EnumType(["red", "blue"]);

// Define global parent option `debug`.
const fooCommand = new Command<
  { debug?: true },
  { color: typeof colorType }
>()
  // Add foo command options.
  .option("-b, --bar", "...")
  .option("-c, --color <color-name:color>", "...")
  .action((options) => {
    if (options.debug) {
      console.log("debug");
    }
    if (options.bar) {
      console.log("bar");
    }
    if (options.color) {
      console.log("color", options.color);
    }
    // @ts-expect-error option foo does not exist.
    if (options.foo) {
      console.log("foo");
    }
  });

await new Command<void>()
  .globalType("color", colorType)
  .globalOption("-d, --debug", "...")
  .command("foo", fooCommand)
  .parse(Deno.args);
```

## ❯ Upgrade command

Cliffy provides an `UpgradeCommand` that can be used to upgrade your cli to a
given or latest version.

```shell
COMMAND upgrade --version 1.0.2
```

If you register the `upgrade` command you need to register an registry
`provider`. Optional you can define the `main` file of your cli which defaults
to the name of your cli (`[name].ts`) and `args` which can be used to define
permissions that are passed to `deno install`.

If no `args` are defined, following args are set by default: `--no-check`,
`--quiet`, `--force` and `--name`. `--no-check` and `--quiet` are not set by
default if `args` are defined. `--force` and `--name` are always set by default.

```typescript
import { UpgradeCommand } from "https://deno.land/x/cliffy/command/upgrade/mod.ts";
cmd.command(
  "upgrade",
  new UpgradeCommand({
    main: "cliffy.ts",
    args: ["--allow-net", "--unstable"],
    provider: new DenoLandProvider(),
  }),
);
```

There are three build in providers: `deno.land`, `nest.land` and `github`. If
multiple providers are registered, you can specify the registry that should be
used with the `--registry` option. The github provider can also be used to
`upgrade` to any git branch.

```shell
COMMAND upgrade --registry github --version main
```

The `--registry` option is hidden if only one provider is registered. If the
`upgrade` command is called without the `--registry` option, the default
registry is used. The default registry is the first registered provider.

The `GithubProvider` requires the `repository` name as option. The
`DenoLandProvider` and `NestLandProvider` does not require any options but you
can optionally pass the registry module name to the provider which defaults to
the command name.

```typescript
cmd.command(
  "upgrade",
  new UpgradeCommand({
    provider: [
      new DenoLandProvider({ name: "cliffy" }),
      new NestLandProvider({ name: "cliffy" }),
      new GithubProvider({ repository: "c4spar/deno-cliffy" }),
    ],
  }),
);
```

The upgrade command can be also used, to list all available versions with the
`-l` or `--list-versions` option. The current installed version is highlighted
and prefix with a `*`.

```console
$ COMMAND upgrade -l
* v0.2.2
  v0.2.1
  v0.2.0
  v0.1.0
```

The github registry shows all available tags and branches. Branches can be
disabled with the `branches` option `GithubProvider({ branches: false })`. If
the versions list is larger than `25`, the versions are displayed as table.

```console
$ COMMAND upgrade --registry github --list-versions
Tags:

  v0.18.2   v0.17.0   v0.14.1   v0.11.2   v0.8.2   v0.6.1   v0.3.0
  v0.18.1 * v0.16.0   v0.14.0   v0.11.1   v0.8.1   v0.6.0   v0.2.0
  v0.18.0   v0.15.0   v0.13.0   v0.11.0   v0.8.0   v0.5.1   v0.1.0
  v0.17.2   v0.14.3   v0.12.1   v0.10.0   v0.7.1   v0.5.0
  v0.17.1   v0.14.2   v0.12.0   v0.9.0    v0.7.0   v0.4.0

Branches:

  main (Protected)
  keypress/add-keypress-module
  keycode/refactoring
  command/upgrade-command
```

## ❯ Version option

The `--version` and `-V` option flag prints the version number defined with the
`version()` method. The version number will also be printed within the output of
the [help](#help-option-command) option and command.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .version("0.1.0")
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/version_options.ts -V
$ deno run https://deno.land/x/cliffy/examples/command/version_options.ts --version
0.0.1
```

### Customize version option

The version option is completely customizable with the `.versionOption()`
method. The first argument are the flags followed by the description. The third
argument can be an action handler or an options object. The second and third
argument's are optional.

```typescript
await new Command()
  .version("0.1.0")
  .versionOption(
    " -x, --xversion",
    "Print version info.",
    function (this: Command) {
      console.log("Version: %s", this.getVersion());
    },
  )
  .parse(Deno.args);
```

You can also override the default options of the version option. The options are
the same as for the `.option()` method.

```typescript
await new Command()
  .version("0.1.0")
  .versionOption(" -x, --xversion", "Print version info.", { global: true })
  .parse(Deno.args);
```

The version option can be also disabled.

```typescript
await new Command()
  .versionOption(false)
  .parse(Deno.args);
```

## ❯ Contributing

Any kind of contribution is welcome! Please take a look at the
[contributing guidelines](../CONTRIBUTING.md).

## ❯ License

[MIT](../LICENSE)
