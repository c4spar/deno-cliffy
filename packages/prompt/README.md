# Cliffy - Prompt 

Create interactive prompts like: checkbox, confirm, input, number, select, etc...

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github) ![GitHub Release Date](https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github)

![Build Status](https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master) ![Deno version](https://img.shields.io/badge/deno-v0.41.0|v0.40.0|v0.39.0-green?logo=deno) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/c4spar/deno-cliffy?logo=github) ![GitHub issues](https://img.shields.io/github/issues/c4spar/deno-cliffy?logo=github) ![GitHub licence](https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github)

## Prompts

### Confirm

```typescript
import { Confirm } from 'https://deno.land/x/cliffy/prompt.ts';

await Confirm.prompt( {
    message: '[CONFIRM] How old are you?'
} );
```

### Input

```typescript
import { Input } from 'https://deno.land/x/cliffy/prompt.ts';

await Input.prompt( {
    message: '[INPUT] How old are you?'
} );
```

### Number

```typescript
import { Number } from 'https://deno.land/x/cliffy/prompt.ts';

await Number.prompt( {
    message: '[NUMBER] How old are you?'
} );
```

### Select

```typescript
import { Select } from 'https://deno.land/x/cliffy/prompt.ts';

await Select.prompt( {
    message: '[SELECT] How old are you?',
    values: [ 'one', 'two', new Separator(), 'three' ]
} );
```

### Checkbox

```typescript
import { Checkbox } from 'https://deno.land/x/cliffy/prompt.ts';

await Checkbox.prompt( {
    message: '[CHECKBOX] How old are you?',
    values: [ 'one', 'two', new Separator(), 'three' ]
} );
```

## License

[MIT](LICENSE)
