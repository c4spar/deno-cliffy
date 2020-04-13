# Cliffy - Table 

Render data in table structure with correct indentation and support for multi-line rows.

![Build Status](https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master)

## Usage

**Simple table:**

```typescript
import { Table } from 'https://deno.land/x/cliffy/table.ts';

Table.from( [
        [ 'Flags', 'Description', 'Types' ],
        [ 'cell1', 'cell2', 'cell3' ],
        [ 'cell1', 'cell2', 'cell3' ],
        [ 'cell1', 'cell2', 'cell3' ]
    ] )
    .maxCellWidth( 50 )
    .padding( 1 )
    .indent( 2 )
    .border( true )
    .render();
```

```
  ┌───────┬─────────────┬───────┐
  │ Flags │ Description │ Types │
  ├───────┼─────────────┼───────┤
  │ cell1 │ cell2       │ cell3 │
  ├───────┼─────────────┼───────┤
  │ cell1 │ cell2       │ cell3 │
  ├───────┼─────────────┼───────┤
  │ cell1 │ cell2       │ cell3 │
  └───────┴─────────────┴───────┘
```

**Multiline rows:**

```typescript
import { Table } from 'https://deno.land/x/cliffy/table.ts';

Table.from( [
        [ 'Flags', 'Description', 'Types' ],
        [ 'cell1', 'cell2', 'cell3' ],
        [ 'cell1', 'Lorem ipsum dolor sit amet, at nam scripta fierent imperdiet. Et vim eruditi definitiones, quo cu accusamus mediocritatem. Graeci sapientem et eum. Cu dicat vivendum qui, ius percipit conceptam ne. Magna veniam ut his.', 'cell3' ],
        [ 'cell1', 'cell2', 'cell3' ]
    ] )
    .maxCellWidth( [ 10, 40, 10 ] )
    .padding( 1 )
    .indent( 2 )
    .border( true )
    .render();

```

```
  ┌───────┬────────────────────────────────────┬───────┐
  │ Flags │ Description                        │ Types │
  ├───────┼────────────────────────────────────┼───────┤
  │ cell1 │ cell2                              │ cell3 │
  ├───────┼────────────────────────────────────┼───────┤
  │ cell1 │ Lorem ipsum dolor sit amet, at nam │ cell3 │
  │       │ scripta fierent imperdiet. Et vim  │       │
  │       │ eruditi definitiones, quo cu       │       │
  │       │ accusamus mediocritatem. Graeci    │       │
  │       │ sapientem et eum. Cu dicat         │       │
  │       │ vivendum qui, ius percipit         │       │
  │       │ conceptam ne. Magna veniam ut his. │       │
  ├───────┼────────────────────────────────────┼───────┤
  │ cell1 │ cell2                              │ cell3 │
  └───────┴────────────────────────────────────┴───────┘
```

## License

[MIT](LICENSE)
