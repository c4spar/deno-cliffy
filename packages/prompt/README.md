<h1 align="center">Cliffy ❯ Prompt</h1>

<p align="center">
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img src="https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github" alt="version" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img src="https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github" alt="release date" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img src="https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master" alt="build status" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" alt="licence" />
  </a>
</p>

<p align="center">
  <b> Create beautiful interactive prompts</b></br>
  <sub>>_ Input, Number, Confirm, Toggle, List, Select, Checkbox and many more...<sub>
</p>

## ❯ Content

* [Usage](#-usage)
* [Types](#-types)

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

> Work in progress

### 📃 Prompt List

> Work in progress

### 💫 Dynamic Prompts

> Work in progress

## ❯ Types

* [input](#%EF%B8%8F-input)
* [number](#1%EF%B8%8F2%EF%B8%8F3%EF%B8%8F-number)
* [confirm](#-confirm)
* [toggle](#-toggle)
* [list](#-list)
* [select](#-select)
* [checkbox](#%EF%B8%8F-checkbox)

**Options**

All prompts have the following base options:

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| message | `string` | Yes | Prompt message to display. |
| default | `T` | No | Default value. Type depends on prompt type. |
| sanitize | `( value: V ) => T | undefined` | No | Receive user input. The returned value will be returned by the `.prompt()` method. |
| validate | `( value: T | undefined ) => ValidateResult` | No | Receive sanitized user input. Should return `true` if the value is valid, and an error message `String` otherwise. If `false` is returned, a default error message is shown |
| hint | `string` | No | Hint to display to the user. (not implemented) |

***

### ✏️ Input

**Example**

```typescript
import { Input } from 'https://deno.land/x/cliffy/prompt.ts';

const name: string = await Input.prompt( `What's your name?` );
```

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |

**↑ back to:** [Prompt types](#-types)

***

### 1️2️3️ Number

**Example**

```typescript
import { Number } from 'https://deno.land/x/cliffy/prompt.ts';

const age: number = await Number.prompt( 'How old are you?' );
```

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| min | `number` | No | Min value. Defaults to `-infinity`. |
| max | `number` | No | Max value. Defaults to `Infinity`. |
| float | `boolean` | No | Allow floating point inputs. Defaults to `false`. |
| round | `number` | No | Round float values to `x` decimals. Defaults to `2`. |

**↑ back to:** [Prompt types](#-types)

***

### 👌 Confirm

**Example**

```typescript
import { Confirm } from 'https://deno.land/x/cliffy/prompt.ts';

const pizza: boolean = await Confirm.prompt( 'Would you like to buy a pizza?' );
```

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| active | `string` | No | Text for `active` state. Defaults to `'Yes'`. |
| inactive | `string` | No | Text for `inactive` state. Defaults to `'No'`. |

**↑ back to:** [Prompt types](#-types)

***

### 🔘 Toggle

**Example**

```typescript
import { Toggle } from 'https://deno.land/x/cliffy/prompt.ts';

const pizza: boolean = await Toggle.prompt( 'Would you like to buy a pizza?' );
```

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| active | `string` | No | Text for `active` state. Defaults to `'Yes'`. |
| inactive | `string` | No | Text for `inactive` state. Defaults to `'No'`. |

**↑ back to:** [Prompt types](#-types)

***

### 🚃,🚃,🚃 List

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| separator | `string` | No | String separator. Will trim all white-spaces from start and end of string. Defaults to `','`. |

**Example**

```typescript
import { List } from 'https://deno.land/x/cliffy/prompt.ts';

const keywords: string[] = await List.prompt( 'Enter keywords' );
```

**↑ back to:** [Prompt types](#-types)

***

### ❯ Select

**Example**

```typescript
import { Select, Separator } from 'https://deno.land/x/cliffy/prompt.ts';

const pizza: string = await Select.prompt( {
    message: 'Select your pizza?',
    values: ['Margherita', 'Caprese', Select.Separator( 'Special' ), {name: 'Diavola', disabled: true}]
} );
```

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| indent | `string` | No | List indentation. Defaults to `' '` |
| maxRows | `number` | No | Number of options displayed per page. Defaults to `10`. |
| values | `object | (string|object)[]` | Yes | Object `{[name: string]: string | {label?, disabled? }}` or Array of strings or objects `[{ name, label?, disabled? }, ...]`. |

**Value Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| name | `string` | Only if used in `Array` | Value which will be returned as result. |
| label | `string` | No | Label is displayed in the list. Defaults to `name` |
| disabled | `boolean` | No | Disabled item. Can't be selected. |

**↑ back to:** [Prompt types](#-types)

***

### ✔️ Checkbox

**Example**

```typescript
import { Checkbox, Separator } from 'https://deno.land/x/cliffy/prompt.ts';

const pizza: string[] = await Checkbox.prompt( {
    message: 'Select your pizza?',
    values: [ 'Margherita', 'Caprese', Checkbox.Separator( 'Special' ), {name: 'Diavola', disabled: true}]
} );
```

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| pointer | `string` | No | Change the pointer icon. |
| check | `string` | No | Change the check icon. |
| uncheck | `string` | No | Change the uncheck icon. |
| indent | `string` | No | List indentation. Defaults to `' '` |
| maxRows | `number` | No | Number of options displayed per page. Defaults to `10`. |
| values | `object | (string|object)[]` | Yes | Object `{[name: string]: string | {label?, disabled?, checked? }}` or Array of strings or objects `[{ name, label?, disabled?, checked? }, ...]`. |

**Value Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| name | `string` | Only if used in `Array` | Value which will be added to the returned result array. |
| label | `string` | No | Label is displayed in the list. Defaults to `name`. |
| disabled | `boolean` | No | Disabled item. Can't be selected. |
| checked | `boolean` | No | Whether item is checked or not. Defaults to `false`. |
| icon | `boolean` | No | Show or hide item icon. Defaults to `true`. |

**↑ back to:** [Prompt types](#-types)

## License

[MIT](LICENSE)
