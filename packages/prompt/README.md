# Cliffy - Prompt 

Create interactive prompts like: checkbox, confirm, input, number, select, etc...

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github) ![GitHub Release Date](https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github)

![Build Status](https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master) ![Deno version](https://img.shields.io/badge/deno-v0.41.0|v0.40.0|v0.39.0-green?logo=deno) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/c4spar/deno-cliffy?logo=github) ![GitHub issues](https://img.shields.io/github/issues/c4spar/deno-cliffy?logo=github) ![GitHub licence](https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github)

* [Usage](#❯-types)
* [Types](#❯-types)
* [API](#❯-api)

## ❯ Usage

### ✏️ Single Prompt

Execute a single prompt with a single message which returns the user input.

```typescript
const result = await Input.prompt('Do you prefer cats or dogs?');
```

Execute a single prompt with an options object.

```typescript
const result = await Input.prompt({message: 'Do you prefer cats or dogs?'});
```

### 🔗 Prompt Chain

> Working progress

### 📃 Prompt List

> Working progress

### 💫 Dynamic Prompts

> Working progress

## ❯ Types

* [input](#--input)
* [number](#--number)
* [confirm](#--confirm)
* [toggle](#--toggle)
* [list](#--list)
* [select](#--select)
* [checkbox](#--checkbox)

## ❯ API

**Options**

All prompts have the following base options:

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| message | `string` | Yes | Prompt message to display. |
| default | `T` | No | Default value. Type depends on prompt type. |
| sanitize | `( value: V ) => T | undefined` | No | Receive user input. The returned value will be returned by the `.prompt()` method. |
| validate | `( value: T | undefined ) => ValidateResult` | No | Receive sanitized user input. Should return `true` if the value is valid, and an error message `String` otherwise. If `false` is returned, a default error message is shown |
| hint | `string` | No | Hint to display to the user. (not implemented) |

### ✏️ Input

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |

**Example**

```typescript
import { Input } from 'https://deno.land/x/cliffy/prompt.ts';

await Input.prompt( {
    message: `What's your name?`
} );
```

### 1️2️3️Number

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| min | `number` | No | Min value. Defaults to `-infinity`. |
| max | `number` | No | Max value. Defaults to `Infinity`. |
| float | `boolean` | No | Allow floating point inputs. Defaults to `false`. |
| round | `number` | No | Round float values to `x` decimals. Defaults to `2`. |

**Example**

```typescript
import { Number } from 'https://deno.land/x/cliffy/prompt.ts';

await Number.prompt( {
    message: 'How old are you?'
} );
```

### 👌 Confirm

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| active | `string` | No | Text for `active` state. Defaults to `'Yes'`. |
| inactive | `string` | No | Text for `inactive` state. Defaults to `'No'`. |

**Example**

```typescript
import { Confirm } from 'https://deno.land/x/cliffy/prompt.ts';

await Confirm.prompt( {
    message: 'Would you like to buy a pizza?'
} );
```

### 🔘 Toggle

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| active | `string` | No | Text for `active` state. Defaults to `'Yes'`. |
| inactive | `string` | No | Text for `inactive` state. Defaults to `'No'`. |

**Example**

```typescript
import { Toggle } from 'https://deno.land/x/cliffy/prompt.ts';

await Toggle.prompt( {
    message: 'Would you like to buy a pizza?'
} );
```

### 🚃,🚃,🚃 List

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| separator | `string` | No | String separator. Will trim all white-spaces from start and end of string. Defaults to `','`. |

**Example**

```typescript
import { List } from 'https://deno.land/x/cliffy/prompt.ts';

await List.prompt( {
    message: 'Enter comma separated keywords'                
} );
```

### ❯ Select

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| indent | `string` | No | List indentation. Defaults to `' '` |
| maxRows | `number` | No | String separator. Will trim all white-spaces from start and end of string. Defaults to `','`. |
| values | `string` | Yes | Object `{[name: string]: string | {label?, disabled? }}` or Array of strings or objects `[{ name, label?, disabled? }, ...]`. |

**Value Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| name | `string` | Only if used in `Array` | The name is used as key for the results object. |
| label | `string` | No | Label is displayed in the list. Defaults to `name` |
| disabled | `boolean` | No | String separator. Will trim all white-spaces from start and end of string. Defaults to `','`. |

**Example**

```typescript
import { Select, Separator } from 'https://deno.land/x/cliffy/prompt.ts';

await Select.prompt( {
    message: 'Select your pizza?',
    values: [ 'margherita', 'caprese', new Separator( 'Special' ), 'diavola' ]
} );
```

### ✔️ Checkbox

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| check | `string` | No | Change the check icon. |
| uncheck | `string` | No | Change the uncheck icon. |
| indent | `string` | No | List indentation. Defaults to `' '` |
| maxRows | `number` | No | String separator. Will trim all white-spaces from start and end of string. Defaults to `','`. |
| values | `string` | Yes | Object `{[name: string]: string | {label?, disabled?, checked? }}` or Array of strings or objects `[{ name, label?, disabled?, checked? }, ...]`. |

**Value Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| name | `string` | Only if used in `Array` | The name is used as key for the results object. |
| label | `string` | No | Label is displayed in the list. Defaults to `name`. |
| disabled | `boolean` | No | String separator. Will trim all white-spaces from start and end of string. Defaults to `','`. |
| checked | `boolean` | No | Whether item is checked or not. Defaults to `false`. |
| icon | `boolean` | No | Show or hide item icon. Defaults to `true`. |

**Example**

```typescript
import { Checkbox, Separator } from 'https://deno.land/x/cliffy/prompt.ts';

await Checkbox.prompt( {
    message: `Du you like any extra's?`,
    values: [ 'mozzarella', 'olive', new Separator( 'Special' ), 'buffalo mozzarella' ]
} );
```

## License

[MIT](LICENSE)
