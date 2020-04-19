# Cliffy - Prompt 

Create interactive prompts like: checkbox, confirm, input, number, select, etc...

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github) ![GitHub Release Date](https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github)

![Build Status](https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master) ![Deno version](https://img.shields.io/badge/deno-v0.41.0|v0.40.0|v0.39.0-green?logo=deno) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/c4spar/deno-cliffy?logo=github) ![GitHub issues](https://img.shields.io/github/issues/c4spar/deno-cliffy?logo=github) ![GitHub licence](https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github)

## Prompts

### Confirm

```typescript
import { Confirm } from 'https://deno.land/x/cliffy/prompt.ts';

await Confirm.prompt( {
    message: 'Would you like to buy a pizza?'
} );
```

### Toggle

```typescript
import { Toggle } from 'https://deno.land/x/cliffy/prompt.ts';

await Toggle.prompt( {
    message: 'Would you like to buy a pizza?'
} );
```

### Input

```typescript
import { Input } from 'https://deno.land/x/cliffy/prompt.ts';

await Input.prompt( {
    message: `What's your name?`
} );
```

### Number

```typescript
import { Number } from 'https://deno.land/x/cliffy/prompt.ts';

await Number.prompt( {
    message: 'How old are you?'
} );
```

### List

```typescript
import { List } from 'https://deno.land/x/cliffy/prompt.ts';

await List.prompt( {
    message: 'Enter keywords'                
} );
```

### Select

```typescript
import { Select, Separator } from 'https://deno.land/x/cliffy/prompt.ts';

await Select.prompt( {
    message: 'Select your pizza?',
    values: [ 'margherita', 'caprese', new Separator( 'Special' ), 'diavola' ]
} );
```

### Checkbox

```typescript
import { Checkbox, Separator } from 'https://deno.land/x/cliffy/prompt.ts';

await Checkbox.prompt( {
    message: `Du you like any extra's?`,
    values: [ 'mozzarella', 'olive', new Separator( 'Special' ), 'buffalo mozzarella' ]
} );
```

## License

[MIT](LICENSE)
