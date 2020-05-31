<h1 align="center">Cliffy ❯ Prompt</h1>

<p align="center">
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Version" src="https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Release date" src="https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github" />
  </a>
  <a href="https://deno.land/">
    <img alt="Deno version" src="https://img.shields.io/badge/deno-v1.0.2-green?logo=deno" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Build status" src="https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/labels/module%3Aprompt">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy/module:prompt?label=issues&logo=github">
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Licence" src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" />
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
const result: string = await Input.prompt('Do you prefer cats or dogs?');
```

Execute a single prompt with an options object.

```typescript
const result: string = await Input.prompt({message: 'Do you prefer cats or dogs?'});
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
* [secret](#-secret)
* [confirm](#-confirm)
* [toggle](#-toggle)
* [list](#---list)
* [select](#-select)
* [checkbox](#%EF%B8%8F-checkbox)

#### Base Options

All prompts have the following base options:

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| message | `string` | Yes | Prompt message to display. |
| default | `T` | No | Default value. Type depends on prompt type. |
| transform | `(value: V) => T \| undefined` | No | Receive user input. The returned value will be returned by the `.prompt()` method. |
| validate | `(value: T \| undefined) => ValidateResult` | No | Receive sanitized user input. Should return `true` if the value is valid, and an error message `String` otherwise. If `false` is returned, a default error message is shown |
| hint | `string` | No | Hint to display to the user. (not implemented) |
| pointer | `string` | No | Change the pointer icon. |

***

### ✏️ Input

**Example**

```typescript
import { Input } from 'https://deno.land/x/cliffy/prompt.ts';

const name: string = await Input.prompt( `What's your name?` );
```

**Options**

The `Input` prompt has all [base](#base-options) and the following prompt specific options.

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| minLength | `number` | No | Min length of value. Defaults to `1`. |
| maxLength | `number` | No | Max length of value. Defaults to `infinity`. |

**↑ back to:** [Prompt types](#-types)

***

### 1️2️3️ Number

**Example**

```typescript
import { Number } from 'https://deno.land/x/cliffy/prompt.ts';

const age: number = await Number.prompt( 'How old are you?' );
```

**Options**

The `Number` prompt has all [base options](#base-options) and the following prompt specific options.

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| min | `number` | No | Min value. Defaults to `-infinity`. |
| max | `number` | No | Max value. Defaults to `Infinity`. |
| float | `boolean` | No | Allow floating point inputs. Defaults to `false`. |
| round | `number` | No | Round float values to `x` decimals. Defaults to `2`. |

**↑ back to:** [Prompt types](#-types)

***

### 🔑 Secret

**Example**

```typescript
import { Secret } from 'https://deno.land/x/cliffy/prompt.ts';

const password: string = await Secret.prompt( 'Enter your password?' );
```

**Options**

The `Secret` prompt has all [base options](#base-options) and the following prompt specific options.

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| minLength | `number` | No | Min length of secret value. Defaults to `1`. |
| maxLength | `number` | No | Max length of secret value. Defaults to `infinity`. |
| hidden | `number` | No | Hide input during typing and show a fix number of asterisk's on success. |

**↑ back to:** [Prompt types](#-types)

***

### 👌 Confirm

**Example**

```typescript
import { Confirm } from 'https://deno.land/x/cliffy/prompt.ts';

const pizza: boolean = await Confirm.prompt( 'Would you like to buy a pizza?' );
```

**Options**

The `Config` prompt has all [base options](#base-options) and the following prompt specific options.

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
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

The `Toggle` prompt has all [base options](#base-options) and the following prompt specific options.

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| active | `string` | No | Text for `active` state. Defaults to `'Yes'`. |
| inactive | `string` | No | Text for `inactive` state. Defaults to `'No'`. |

**↑ back to:** [Prompt types](#-types)

***

### 🚃, 🚃, 🚃 List

**Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| separator | `string` | No | String separator. Will trim all white-spaces from start and end of string. Defaults to `','`. |

**Example**

The `List` prompt has all [base options](#base-options) and the following prompt specific options.

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
    options: ['Margherita', 'Caprese', Select.Separator( 'Special' ), {name: 'Diavola', disabled: true}]
} );
```

**Options**

The `Select` prompt has all [base options](#base-options) and the following prompt specific options.

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| options | `(string \| Option)[]` | Yes | Array of string's or Option's. |
| maxRows | `number` | No | Number of options displayed per page. Defaults to `10`. |
| indent | `string` | No | List indentation. Defaults to `' '` |
| listPointer | `string` | No | Change the list pointer icon. |

**`Option` Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| value | `string` | Yes | Value which will be returned as result. |
| name | `string` | No | Name is displayed in the list. Defaults to `value` |
| disabled | `boolean` | No | Disabled item. Can't be selected. |

**↑ back to:** [Prompt types](#-types)

***

### ✔️ Checkbox

**Example**

```typescript
import { Checkbox, Separator } from 'https://deno.land/x/cliffy/prompt.ts';

const pizza: string[] = await Checkbox.prompt( {
    message: 'Select your pizza?',
    options: [ 'Margherita', 'Caprese', Checkbox.Separator( 'Special' ), {value: 'Diavola', disabled: true}]
} );
```

**Options**

The `Checkbox` prompt has all [base options](#base-options) and the following prompt specific options.

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| options | `(string \| Option)[]` | Yes | Array of string's or Option's. |
| maxRows | `number` | No | Number of options displayed per page. Defaults to `10`. |
| indent | `string` | No | List indentation. Defaults to `' '` |
| listPointer | `string` | No | Change the list pointer icon. |
| check | `string` | No | Change the check icon. |
| uncheck | `string` | No | Change the uncheck icon. |

**`Option` Options**

| Param | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| value | `string` | Yes | Value which will be added to the returned result array. |
| name | `string` | No | Name is displayed in the list. Defaults to `value`. |
| disabled | `boolean` | No | Disabled item. Can't be selected. |
| checked | `boolean` | No | Whether item is checked or not. Defaults to `false`. |
| icon | `boolean` | No | Show or hide item icon. Defaults to `true`. |

**↑ back to:** [Prompt types](#-types)

## License

[MIT](LICENSE)
