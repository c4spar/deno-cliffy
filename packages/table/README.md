<h1 align="center">Cliffy ❯ Table </h1>

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
  <a href="https://github.com/c4spar/deno-cliffy/labels/module%3Atable">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy/module:table?label=issues&logo=github">
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Licence" src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" />
  </a>
</p>

<p align="center">
  <b> Easy solution to render table's on the command line </b></br>
  <sub>>_ Create cli table's with border, padding, nested table's, etc... <sub>
</p>


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
