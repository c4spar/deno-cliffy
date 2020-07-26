<h1 align="center">Cliffy ❯ Flags </h1>

<p align="center">
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Version" src="https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Release date" src="https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github&color=blue" />
  </a>
  <a href="https://deno.land/">
    <img alt="Deno version" src="https://img.shields.io/badge/deno-^1.2.0-blue?logo=deno" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Build status" src="https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/labels/module%3Aflags">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy/module:flags?label=issues&logo=github">
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Licence" src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" />
  </a>
</p>

<p align="center">
  <b> Command line arguments parser for <a href="https://deno.land/">Deno</a></b></br>
  <sub>>_ Used by cliffy's <a href="../command/">command</a> module<sub>
</p>

## Usage

```typescript
import { parseFlags } from 'https://deno.land/x/cliffy/flags.ts';

console.log( parseFlags( Deno.args ) );
```

```
$ deno run https://deno.land/x/cliffy/examples/flags/flags.ts -a foo -b bar
{ flags: { a: "foo", b: "bar" }, unknown: [], literal: [] }
```

```
$ deno run https://deno.land/x/cliffy/examples/flags/flags.ts -x 3 -y 4 -n5 -abc --beep=boop foo bar baz
{
  flags: { x: "3", y: "4", n: "5", a: true, b: true, c: true, beep: "boop" },
  unknown: [ "foo", "bar", "baz" ],
  literal: []
}
```

### With Options

```typescript
import { parseFlags, OptionType } from 'https://deno.land/x/cliffy/flags.ts';

const result = parseFlags( Deno.args, {
    allowEmpty: true,
    stopEarly: true,
    flags: [ {
        name: 'help',
        aliases: [ 'h' ],
        // a standalone option cannot be combined with other options
        standalone: true
    }, {
        name: 'verbose',
        aliases: [ 'v' ],
        // allow to define this option multiple times on the command line
        collect: true,
        // make --verbose incremental: turn value into an number and increase the value for each --verbose option
        value: ( val: boolean, previous: number = 0 ) => val ? previous + 1 : 0
    }, {
        name: 'debug',
        aliases: [ 'd' ],
        type: OptionType.BOOLEAN,
        optionalValue: true
    }, {
        name: 'silent',
        aliases: [ 's' ]
    }, {
        name: 'amount',
        aliases: [ 'n' ],
        type: OptionType.NUMBER,
        requiredValue: true
    }, {
        name: 'file',
        aliases: [ 'f' ],
        type: OptionType.STRING,
        // file cannot be combined with stdin option
        conflicts: [ 'stdin' ]
    }, {
        name: 'stdin',
        aliases: [ 'i' ],
        // stdin cannot be combined with file option
        conflicts: [ 'file' ]
    } ]
} );

console.log( result );
```

```
$ deno run https://deno.land/x/cliffy/examples/flags/options.ts -vvv -n5 -f ./example.ts -d 1 -s foo bar baz --beep -- --boop
{
  flags: { verbose: 3, amount: 5, file: "./example.ts", debug: true, silent: true },
  unknown: [ "foo", "bar", "baz", "--beep" ],
  literal: [ "--boop" ]
}
```

## Options

### parseFlags Options

| Param      | Type             | Required | Description                                                                                    |
| ---------- |:----------------:|:--------:| ---------------------------------------------------------------------------------------------- |
| allowEmpty | `boolean`        | No       | Allow no arguments. Defaults to `false`                                                        |
| stopEarly  | `boolean`        | No       | If enabled, all values starting from the first non option argument will be added to `unknown`. |
| flags      | `IFlagOptions[]` | No       | Array of flag options.                                                                         |
| parse      | `function`       | No       | Custom type parser.                                                                            |

### Flag Options

| Param      | Type                                  | Required | Description                                                                                               |
| ---------- |:-------------------------------------:|:--------:| --------------------------------------------------------------------------------------------------------- |
| name       | `string`                              | Yes      | The name of the option.                                                                                   |
| args       | `IFlagArgument[]`                     | No       | An Array of argument options.                                                                             |
| aliases    | `string[]`                            | No       | Array of option alias's.                                                                                  |
| standalone | `boolean `                            | No       | Cannot be combined with other options.                                                                    |
| default    | `any`                                 | No       | Default option value.                                                                                     |
| required   | `boolean `                            | No       | Mark option as required and throw an error if the option is missing.                                      |
| depends    | `string[]`                            | No       | Array of option names that depends on this option.                                                        |
| conflicts  | `string[]`                            | No       | Array of option names that conflicts with this option.                                                    |
| collect    | `boolean`                             | No       | Allow to call this option multiple times and add each value to an array which will be returned as result. |
| value      | `( val: any, previous?: any ) => any` | No       | Custom value processing.                                                                                  |

### Argument options

| Param         | Type                   | Required | Description                     |
| ------------- |:----------------------:|:--------:| ------------------------------- |
| type          | `OptionType \| string` | no       | Type of the argument.           |
| optionalValue | `boolean`              | no       | Make argument optional.         |
| requiredValue | `boolean`              | no       | Make argument required.         |
| variadic      | `boolean`              | no       | Make arguments variadic.        |
| list          | `boolean`              | no       | Split argument by `separator`.  |
| separator     | `string`               | no       | List separator. Defaults to `,` |

### OptionType

* `OptionType.STRING`

* `OptionType.NUMBER`

* `OptionType.BOOLEAN`

## Custom type processing

```typescript
import { parseFlags, IFlagOptions, IFlagArgument } from 'https://deno.land/x/cliffy/flags.ts';

parseFlags( Deno.args, {
    parse: ( type: string, option: IFlagOptions, arg: IFlagArgument, nextValue: string ) => {
        switch ( type ) {
            case 'float':
                if ( isNaN( nextValue as any ) ) {
                    throw new Error( `Option --${ option.name } must be of type number but got: ${ nextValue }` );
                }
                return parseFloat( nextValue );
            default:
                throw new Error( `Unknown type: ${ type }` );
        }
    }
} );
```

## License

[MIT](../../LICENSE)
