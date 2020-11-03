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
    <img alt="Build status" src="https://github.com/c4spar/deno-cliffy/workflows/Test/badge.svg?branch=master" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/labels/module%3Atable">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy/module:table?label=issues&logo=github">
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Licence" src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" />
  </a>
</p>

<p align="center">
  <b>Fast and customizable table module to render unicode table's on the command line</b>
</p>

<p align="center">
  <img alt="table" src="assets/img/random_table.gif"/>
</p>

## ❯ Content

- [Install](#-install)
- [Usage](#-usage)
    - [Basic Usage](#basic-usage)
    - [Using as Array](#using-as-array)
    - [Header and Body](#header-and-body)
    - [Table Options](#table-options)
    - [Row's and Cell's](#rows-and-cells)
    - [Colspan and Rowspan](#colspan-and-rowspan)
- [API](#-api)
- [Contributing](#-contributing)
- [License](#-license)

## ❯ Install

This module can be imported directly from the repo and from following registries.

Deno Registry

```typescript
import { Table } from "https://deno.land/x/cliffy@<version>/table/mod.ts";
```

Nest Registry

```typescript
import { Table } from "https://x.nest.land/cliffy@<version>/table/mod.ts";
```

Github

```typescript
import { Table } from "https://raw.githubusercontent.com/c4spar/deno-cliffy/<version>/table/mod.ts";
```

## ❯ Usage

### Basic Usage

To create a table you can simple create an instance of the `Table` class and pass the rows as arguments to the constructor.
The example below will output a simple table with three rows and without any styles. The only default option is `padding` which is set to `1`.

```typescript
const table: Table = new Table(
  ["Row 1 Column 1", "Row 1 Column 2", "Row 1 Column 3"],
  ["Row 2 Column 1", "Row 2 Column 2", "Row 2 Column 3"],
  ["Row 3 Column 1", "Row 3 Column 2", "Row 3 Column 3"],
);

console.log(table.toString());
// You can also use table.render() as shorthand which uses Deno.stdout.writeSync() under the hood.
```

```
$ deno run https://deno.land/x/cliffy/examples/table/basic_usage.ts
```

![](assets/img/basic_usage.png)

### Using as Array

Since the `Table` class is an `Array`, you can call all the methods of the array class like `.from()`, `.sort()`, `.push()`, `.unshift()` and friends.

```typescript
const table: Table = Table.from([
  ["Row 2 Column 1", "Row 2 Column 2", "Row 2 Column 3"],
  ["Row 1 Column 1", "Row 1 Column 2", "Row 1 Column 3"],
]);

table.push(["Row 3 Column 1", "Row 3 Column 2", "Row 3 Column 3"]);
table.sort();
table.render();
```

```
$ deno run https://deno.land/x/cliffy/examples/table/using_as_array.ts
```

![](assets/img/using_as_array.png)

### Header and Body

To define a table header you can use the `.header()` method. The header is not affected by any `Array` method like `.sort()` because it is stored as a separate property and not in the array stack.
The `.body()` method adds an array of rows to the table and removes all existing rows.

```typescript
new Table()
  .header(["Heading 1", "Heading 2", "Heading 3"])
  .body([
    ["Row 1 Column 1", "Row 1 Column 2", "Row 1 Column 3"],
    ["Row 2 Column 1", "Row 2 Column 2", "Row 2 Column 3"],
    ["Row 3 Column 1", "Row 3 Column 2", "Row 3 Column 3"],
  ])
  .render();
```

```
$ deno run https://deno.land/x/cliffy/examples/table/header_and_body.ts
```

![](assets/img/header_and_body.png)

### Table Options

To customize the table, the table class provides a few chainable option methods. To see a list of all available options go to the [Talbe](#table) API section.

```typescript
new Table()
  .header(["Heading 1", "Heading 2", "Heading 3"])
  .body([
    ["Row 1 Column 1", "Row 1 Column 2", "Row 1 Column 3"],
    ["Row 2 Column 1", "Row 2 Column 2", "Row 2 Column 3"],
    ["Row 3 Column 1", "Row 3 Column 2", "Row 3 Column 3"],
  ])
  .maxColWidth(10)
  .padding(1)
  .indent(2)
  .border(true)
  .render();
```

```
$ deno run https://deno.land/x/cliffy/examples/table/table_options.ts
```

![](assets/img/table_options.png)

### Row's and Cell's

It is also possible to customize single rows and cell. To do this you can use the `Row` and `Cell` class. The `Row` class is also an `Array` class like the `Table` class. To see a list of all available options go to the [Row](#row) or [Cell](#cell) API section.

```typescript
import { Table, Row, Cell } from "https://deno.land/x/cliffy@<version>/table/mod.ts";

new Table()
  .header(Row.from(["Heading 1", "Heading 2", "Heading 3"]).border(true))
  .body([
    [
      "Row 1 Column 1",
      Cell.from("Row 1 Column 2").border(true),
      "Row 1 Column 3",
    ],
    new Row("Row 2 Column 1", "Row 2 Column 2", "Row 2 Column 3").border(true),
    ["Row 3 Column 1", "Row 3 Column 2", "Row 3 Column 3"],
  ])
  .render();
```

```
$ deno run https://deno.land/x/cliffy/examples/table/rows_and_cells.ts
```

![](assets/img/rows_and_cells.png)

### Colspan and Rowspan

Colspan and rowspan allows a single table cell to span the width/height of more than one column and/or row.

```typescript
Table.from([
  [
    Cell.from("Row 1 & 2 Column 1").rowSpan(2),
    "Row 1 Column 2",
    "Row 1 Column 3",
  ],
  [Cell.from("Row 2 Column 2 & 3").colSpan(2)],
  [
    Cell.from("Row 3 & 4 Column 1").rowSpan(2),
    "Row 3 Column 2",
    "Row 3 Column 3",
  ],
  [Cell.from("Row 4 Column 2 & 3").colSpan(2)],
  ["Row 5 Column 1", Cell.from("Row 5 & 6 Column 2 & 3").rowSpan(2).colSpan(2)],
  ["Row 6 Column 1"],
])
  .border(true)
  .render();
```

```
$ deno run https://deno.land/x/cliffy/examples/table/colspan_and_rowspan.ts
```

![](assets/img/colspan_and_rowspan.png)

## ❯ API

- [Table](#table)
    - [.header(row)](#headerrow)
    - [.body(rows)](#bodyrows)
    - [.clone()](#clone)
    - [.toString()](#tostring)
    - [.render()](#render)
    - [.minColWidth(width,override)](#mincolwidthwidthoverride)
    - [.maxColWidth(width,override)](#maxcolwidthwidthoverride)
    - [.indent(width,override)](#indentwidthoverride)
    - [.padding(padding,override)](#paddingpaddingoverride)
    - [.border(enable,override)](#borderenableoverride)
    - [.chars(chars)](#charschars)
    - [.getHeader()](#getheader)
    - [.getBody()](#getbody)
    - [.getMinColWidth()](#getmincolwidth)
    - [.getMaxColWidth()](#getmaxcolwidth)
    - [.getIndent()](#getindent)
    - [.getPadding()](#getpadding)
    - [.getBorder()](#getborder)
- [Row](#row)
    - [.clone()](#clone-1)
    - [.border(enable,override)](#borderenableoverride-1)
    - [.getBorder()](#getborder-1)
- [Cell](#cell)
    - [.clone()](#clone-2)
    - [.border(enable,override)](#borderenableoverride-2)`
    - [.colSpan(span,override)](#colspanspanoverride)
    - [.rowSpan(span,override)](#rowspanspanoverride)
    - [.getBorder()](#getborder-2)
    - [.getColSpan()](#getcolspan)
    - [.getRowSpan()](#getrowspan)

### Table

#### .header(row)

Sets the table header row.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| row | `IRow ` | Yes | Can be an `Array` of `string`'s and `Cell`'s |

*Return type*: `this`

#### .body(rows)

Adds an array of rows to the table and removes all existing rows.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| rows | `Array<IRow>` | Yes | `Array` of row's. A row can be an `Array` of `string`'s and `Cell`'s |

*Return type*: `this`

#### .clone()

Clones the table.

*Return type*: `this`

#### .toString()

Generates the table string.

*Return type*: `string`

#### .render()

Outputs the result of the `.toString()` method with `Deno.stdout.writeSnyc()`.

*Return type*: `this`

#### .minColWidth(width,override)

Set min column with.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| width | `number | Array<number>` | Yes | Min column with. To give all columns the same min width pass a number to `.minColWidth()`, to give each column an indiviuel min width you can pass an `Array<number>` to `.minColWidth()`. |
| override | `boolean` | No | Set override to `false` to prevent overriding existing values. |

*Return type*: `this`

#### .maxColWidth(width,override)

Set max column with.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| width | `number | Array<number>` | Yes | Max column with. To give all columns the same max width pass a number to `. maxColWidth()`, to give each column an indiviuel max width you can pass an `Array<number>` to `. maxColWidth()`. |
| override | `boolean` | No | Set override to `false` to prevent overriding existing values. |

*Return type*: `this`

#### .indent(width,override)

Indent the table output.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| width | `number` | Yes | Indent width. |
| override | `boolean` | No | Set override to `false` to prevent overriding existing values. |

*Return type*: `this`

#### .padding(padding,override)

Set column padding. If border is enabled the padding will be applyed on the left and the right side of each cell.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| padding | `number | number[]` | Yes | Padding with. |
| override | `boolean` | No | Set override to `false` to prevent overriding existing values. |

*Return type*: `this`

#### .border(enable,override)

Enable table border. Doesn't override row and cell settings.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| enable | `boolean` | Yes | Enable or disable table border. |
| override | `boolean` | No | Set override to `false` to prevent overriding existing values. |

*Return type*: `this`

#### .chars(chars)

Override default border characters. Doesn't override row and cell settings.
To change the default border characters globally you can use the static `Table.chars(chars)` method.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| chars | `IBorderOptions` | Yes | An object with border characters. |
| override | `boolean` | No | Set override to `false` to prevent overriding existing values. |

Here is an example of the default border characters:

```typescript
{
    top: "─",
    topMid: "┬",
    topLeft: "┌",
    topRight: "┐",
    bottom: "─",
    bottomMid: "┴",
    bottomLeft: "└",
    bottomRight: "┘",
    left: "│",
    leftMid: "├",
    mid: "─",
    midMid: "┼",
    right: "│",
    rightMid: "┤",
    middle: "│"
}
```

*Return type*: `this`

#### .getHeader()

Returns the header row.

*Return type*: `Row | undefined `

#### .getBody()

Returns all body rows.

*Return type*: `IRow[]`

#### .getMinColWidth()

Get min columns width.

*Return type*: `number | number[]`

#### .getMaxColWidth()

Get max columns width.

*Return type*: `number | number[]`

#### .getIndent()

Get indent width.

*Return type*: `number`

#### .getPadding()

Get padding.

*Return type*: `number | number[]`

#### .getBorder()

Check if border is enabled on the table.

*Return type*: `boolean`

***

### Row

#### .clone()

Clones the row.

*Return type*: `this`

#### .border(enable,override)

Enable row border. Override table settings but not cell settings.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| enable | `boolean` | Yes | Enable or disable table border. |
| override | `boolean` | No | Set override to `false` to prevent overriding existing values. |

*Return type*: `this`

#### .getBorder()

Check if border is enabled on the row.

*Return type*: `boolean`

***

### Cell

#### .clone()

Clones the cell.

*Return type*: `this`

#### .border(enable,override)

Enable cell border. Overrides table and row settings.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| enable | `boolean` | Yes | Enable or disable table border. |
| override | `boolean` | No | Set override to `false` to prevent overriding existing values. |

*Return type*: `this`

#### .colSpan(span,override)

Allows a single table cell to span the width of more than one cell or column. Can be combined with `.rowSpan()`.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| span | `number` | Yes | Number of columns to span the cell. |
| override | `boolean` | No | Set override to `false` to prevent overriding existing values. |

*Return type*: `this`

#### .rowSpan(span,override)

Allows a single table cell to span the height of more than one cell or row. Can be combined with `.colSpan()`.

| Argument | Type | Required | Description |
| ----- | :--: | :--: | ----------- |
| span | `number` | Yes | Number of rows to span the cell. |
| override | `boolean` | No | Set override to `false` to prevent overriding existing values. |

*Return type*: `this`

#### .getBorder()

Check if border is enabled on the cell.

*Return type*: `boolean`

#### .getColSpan()

Get cell column span.

*Return type*: `number`

#### .getRowSpan()

Get cell row span.

*Return type*: `number`

## ❯ Contributing

Any kind of contribution is welcome! Please take a look at the [contributing guidelines](../CONTRIBUTING.md).

## ❯ License

[MIT](../LICENSE)
