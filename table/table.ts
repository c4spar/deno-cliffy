import { border, IBorder } from "./border.ts";
import { Cell, CellValue, Direction, Renderer, ValueParser } from "./cell.ts";
import { Column, ColumnOptions } from "./column.ts";
import { TableLayout } from "./layout.ts";
import { GetRowValue, JsonData, Row, RowOrValue } from "./row.ts";

/** Table options. */
export interface TableSettings<
  TValue extends CellValue,
  THeaderValue extends CellValue,
> {
  indent: number;
  border: boolean;
  align?: Direction;
  maxColWidth: number | number[];
  minColWidth: number | number[];
  padding: number | number[];
  chars: IBorder;
  columns: Array<Column<TValue, THeaderValue>>;
  isDataTable: boolean;
  headerValue?: ValueParser<THeaderValue>;
  cellValue?: ValueParser<TValue>;
  headerRenderer?: Renderer;
  cellRenderer?: Renderer;
}

/** Border characters settings. */
export type BorderOptions = Partial<IBorder>;

// type AnyToTuple<T> = 0 extends T & 1 ? [] : T;
// type UnknownToTuple<T> = T extends unknown ? [] : T;
//
// type Foo = keyof unknown extends keyof unknown ? 1 : 2;

// export type Columns<
//   TRow,
//   THeaderRow,
// > = number extends keyof THeaderRow ? {
//   [Key in keyof THeaderRow]: ColumnOptions<
//     Key extends keyof TRow ? TRow[Key] : unknown,
//     Key extends keyof THeaderRow ? THeaderRow[Key] : unknown
//   >;
// } : number extends keyof TRow ? {
//   [Key in keyof TRow]: ColumnOptions<
//     Key extends keyof TRow ? TRow[Key] : unknown,
//     Key extends keyof THeaderRow ? THeaderRow[Key] : unknown
//   >;
// } :Array<ColumnOptions<TRow, THeaderRow>>;

// export type Columns<
//   TRow,
//   THeaderRow,
// > = keyof TRow | keyof THeaderRow extends infer Keys ? Keys extends number ? {
//       [Key in Keys]: ColumnOptions<
//         Key extends keyof TRow ? TRow[Key] : unknown,
//         Key extends keyof THeaderRow ? THeaderRow[Key] : unknown
//       >;
//     }
//   : Array<ColumnOptions<TRow, THeaderRow>>
//   : never;

type MakeTuple<T> = T extends ReadonlyArray<unknown> ? T : [T];
type MakeArray<T> = T extends ReadonlyArray<unknown> ? T : ReadonlyArray<T>;

export type Columns<
  TRow,
  THeaderRow,
> = ColumnsDef<TRow, THeaderRow>;
// > = ColumnsDef<MakeArray<TRow>, MakeArray<THeaderRow>>;

// export type ColumnsDef<
//   TRow,
//   THeaderRow,
// > = unknown extends THeaderRow
//     ? (Array<ColumnOptions<TRow, THeaderRow>>)
//   : keyof TRow extends keyof THeaderRow
//     ? ColumnsMap<THeaderRow, TRow, THeaderRow>
//   : keyof THeaderRow extends keyof TRow ? ColumnsMap<TRow, TRow, THeaderRow>
//   : Array<ColumnOptions<TRow, THeaderRow>>;

type IsArrayAndNotArray<T, V> = T extends ReadonlyArray<unknown>
  ? (V extends ReadonlyArray<unknown> ? false : true)
  : false;

type IsArrayAndArray<T, V> = T extends ReadonlyArray<unknown>
  ? (V extends ReadonlyArray<unknown> ? true : false)
  : false;

export type ColumnsDef<
  TRow,
  THeaderRow,
> = IsArrayAndNotArray<TRow, THeaderRow> extends true
  ? ColumnsMap<TRow, TRow, ReadonlyArray<THeaderRow>>
  : IsArrayAndNotArray<THeaderRow, TRow> extends true
    ? ColumnsMap<THeaderRow, ReadonlyArray<TRow>, THeaderRow>
  : IsArrayAndArray<TRow, THeaderRow> extends true
    ? keyof TRow extends keyof THeaderRow
      ? ColumnsMap<THeaderRow, TRow, THeaderRow>
    : keyof THeaderRow extends keyof TRow ? ColumnsMap<TRow, TRow, THeaderRow>
    : ReadonlyArray<ColumnOptions<TRow, THeaderRow>>
  : ReadonlyArray<ColumnOptions<TRow, THeaderRow>>;

// export type ColumnsDef<
//   TRow,
//   THeaderRow,
// > = unknown extends TRow & THeaderRow
//     ? Array<ColumnOptions<TRow, THeaderRow>>
//     : unknown extends THeaderRow
//     ? (TRow extends ReadonlyArray<unknown> ? ColumnsMap<TRow, TRow, THeaderRow> : Array<ColumnOptions<TRow, THeaderRow>>)
//   : keyof TRow extends keyof THeaderRow
//     ? ColumnsMap<THeaderRow, TRow, THeaderRow>
//   : keyof THeaderRow extends keyof TRow ? ColumnsMap<TRow, TRow, THeaderRow>
//   : Array<ColumnOptions<TRow, THeaderRow>>;

// export type ColumnsDef<
//   TRow,
//   THeaderRow,
// > = unknown extends THeaderRow
//     ? (keyof TRow extends number ? ColumnsMap<TRow, TRow, THeaderRow>
//     : Array<ColumnOptions<TRow, THeaderRow>>)
//   : keyof TRow extends keyof THeaderRow
//     ? ColumnsMap<THeaderRow, TRow, THeaderRow>
//   : keyof THeaderRow extends keyof TRow ? ColumnsMap<TRow, TRow, THeaderRow>
//   : Array<ColumnOptions<TRow, THeaderRow>>;

// export type Columns<
//   TRow,
//   THeaderRow,
// > = keyof THeaderRow extends never ? (keyof THeaderRow extends never ? never
//     : keyof THeaderRow extends keyof TRow
//       ? ColumnsMap<TRow, TRow, THeaderRow>
//       : Array<ColumnOptions<TRow, THeaderRow>>)
//   : keyof TRow extends keyof THeaderRow
//     ? ColumnsMap<THeaderRow, TRow, THeaderRow>
//     : keyof THeaderRow extends keyof TRow
//       ? ColumnsMap<TRow, TRow, THeaderRow>
//       : Array<ColumnOptions<TRow, THeaderRow>>;

// export type Columns3<
//   TRow,
//   THeaderRow,
// > =
//   keyof TRow extends keyof THeaderRow
//   ? ColumnsMap<THeaderRow, TRow, THeaderRow>
//   : keyof THeaderRow extends keyof TRow
//   ? ColumnsMap<TRow, TRow, THeaderRow>
//   : Array<ColumnOptions<TRow, THeaderRow>>;

// export type Columns<
//   TRows,
//   THeaderRows,
// > =
//   // unknown extends TRows & THeaderRows
//   // ? Array<ColumnOptions<Array<"unknown">, Array<"unknown">>>
//   // : unknown extends TRows
//   // ? ColumnsMap<THeaderRows, Array<unknown>, THeaderRows>
//   // : unknown extends THeaderRows
//   // ? ColumnsMap<TRows, TRows, Array<unknown>>
//   // :
//   keyof TRows extends keyof THeaderRows
//   ? ColumnsMap<THeaderRows, TRows, THeaderRows>
//   : keyof THeaderRows extends keyof TRows
//   ? ColumnsMap<TRows, TRows, THeaderRows>
//   : Array<ColumnOptions<TRows, THeaderRows>>;

type ColumnsMap<TBaseRows, TRows, THeaderRows> = {
  [Key in keyof TBaseRows]?: ColumnOptions<
    Key extends keyof TRows ? TRows[Key]
      : TRows extends ReadonlyArray<unknown> ? TRows[0]
      : unknown,
    Key extends keyof THeaderRows ? THeaderRows[Key]
      : THeaderRows extends ReadonlyArray<unknown> ? THeaderRows[0]
      : unknown
  >;
};

/** Table representation. */
export class Table<
  TRow extends RowOrValue<CellValue> = unknown,
  THeaderRow extends RowOrValue<CellValue> = unknown,
> extends Array<TRow> {
  protected static _chars: IBorder = { ...border };
  protected options: TableSettings<GetRowValue<TRow>, GetRowValue<THeaderRow>> =
    {
      indent: 0,
      border: false,
      maxColWidth: Infinity,
      minColWidth: 0,
      padding: 1,
      chars: { ...Table._chars },
      columns: [],
      isDataTable: false,
    };
  private headerRow?: Row<GetRowValue<THeaderRow>>;

  /**
   * Create a new table. If rows is a table, all rows and options of the table
   * will be copied to the new table.
   * @param rows
   */
  public static from<
    TRow extends RowOrValue<CellValue>,
    THeaderRow extends RowOrValue<CellValue>,
  >(
    rows: Array<TRow> | Table<TRow, THeaderRow>,
  ): Table<TRow, THeaderRow> {
    const table = new this<TRow, THeaderRow>(...rows);
    if (rows instanceof Table) {
      table.options = { ...(rows as Table<TRow, THeaderRow>).options };
      table.headerRow = rows.headerRow ? Row.from(rows.headerRow) : undefined;
    }
    return table;
  }

  /**
   * Create a new table from an array of json objects. An object represents a
   * row and each property a column.
   * @param rows Array of objects.
   */
  public static fromJson<TValue extends CellValue>(
    rows: Array<JsonData<TValue>>,
  ): Table<Array<TValue>, Array<string>> {
    return new this().fromJson(rows);
  }

  /**
   * Set global default border characters.
   * @param chars Border options.
   */
  public static chars(chars: BorderOptions): typeof Table {
    Object.assign(this._chars, chars);
    return this;
  }

  /**
   * Write table or rows to stdout.
   * @param rows Table or rows.
   */
  public static render<
    TRow extends RowOrValue<CellValue>,
    THeaderRow extends RowOrValue<CellValue>,
  >(
    rows: Array<TRow> | Table<TRow, THeaderRow>,
  ): void {
    Table.from(rows).render();
  }

  /**
   * Read data from an array of json objects. An object represents a
   * row and each property a column.
   * @param rows Array of objects.
   */
  public fromJson<TJsonValue extends CellValue>(
    rows: Array<JsonData<TJsonValue>>,
  ): Table<Array<TJsonValue>, Array<string>> {
    return (this as unknown as Table<Array<TJsonValue>, Array<string>>)
      .header(Object.keys(rows[0]))
      .body(rows.map((row) => Object.values(row)));
  }

  /**
   * Set column definitions.
   * @param columns Array of columns or column options.
   */
  public columns(
    columns: Columns<TRow, THeaderRow>,
  ): this {
    const cols = columns as Array<ColumnOptions<TRow, THeaderRow>>;
    this.options.columns = cols.map((column) =>
      column instanceof Column ? column : Column.from(column)
    ) as Array<Column<GetRowValue<TRow>, GetRowValue<THeaderRow>>>;
    return this;
  }

  /**
   * Set column definitions for a single column.
   * @param index   Column index.
   * @param column  Column or column options.
   */
  public column(
    index: number,
    column:
      | Column<GetRowValue<TRow>, GetRowValue<THeaderRow>>
      | ColumnOptions<GetRowValue<TRow>, GetRowValue<THeaderRow>>,
  ): this {
    if (column instanceof Column) {
      this.options.columns[index] = column;
    } else if (this.options.columns[index]) {
      this.options.columns[index].options(column);
    } else {
      this.options.columns[index] = Column.from(column);
    }
    return this;
  }

  /**
   * Set table header.
   * @param header Header row or cells.
   */
  // public header<
  //   THeader extends THeaderRow,
  //   THeaderValue extends GetRowValue<THeader>,
  // >(
  //   header: RowOrValue<THeaderValue>,
  // ): Table<TRow, Row<THeaderValue>> {
  //   const table = this as Table<TRow, Row<THeaderValue>>;
  //   table.headerRow = header instanceof Row ? header : Row.from(header);
  //   return table;
  // }

  public header<THeader extends THeaderRow>(
    header: THeader,
  ): Table<TRow, THeader> {
    const table = this as Table<TRow, THeader>;
    table.headerRow = header instanceof Row
      ? header
      : Row.from(header) as Row<GetRowValue<THeaderRow>>;
    return table;
  }

  /**
   * Add an array of rows.
   * @param rows Table rows.
   */
  public rows<TBodyRow extends TRow>(
    rows: Array<TBodyRow>,
  ): Table<TBodyRow, THeaderRow> {
    const table = this as Table<RowOrValue<CellValue>, THeaderRow> as Table<
      TBodyRow,
      THeaderRow
    >;
    table.push(...rows);
    return table;
  }

  /**
   * Set table body.
   * @param rows Table rows.
   */
  public body<TBodyRow extends TRow>(
    rows: Array<TBodyRow>,
  ): Table<TBodyRow, THeaderRow> {
    this.length = 0;
    return this.rows(rows);
  }

  /**
   * Set table data.
   * @param rows Table rows.
   */
  public data<TBodyRow extends TRow>(
    rows: Array<TBodyRow>,
  ): Table<TBodyRow, THeaderRow> {
    return this.fillRows().body(rows);
  }

  /** Clone table recursively with header and options. */
  public clone(): this {
    const rows = this.map((row) =>
      row instanceof Row ? row.clone() : Row.from(row).clone()
    );
    const table = Table.from(rows) as this;
    table.options = { ...this.options };
    table.headerRow = this.headerRow?.clone();
    return table;
  }

  /** Generate table string. */
  public toString(): string {
    return new TableLayout(this, this.options).toString();
  }

  /** Write table to stdout. */
  public render(): this {
    console.log(this.toString());
    return this;
  }

  /**
   * Set max col with.
   * @param width     Max col width.
   * @param override  Override existing value.
   */
  public maxColWidth(width: number | number[], override = true): this {
    if (override || typeof this.options.maxColWidth === "undefined") {
      this.options.maxColWidth = width;
    }
    return this;
  }

  /**
   * Set min col width.
   * @param width     Min col width.
   * @param override  Override existing value.
   */
  public minColWidth(width: number | number[], override = true): this {
    if (override || typeof this.options.minColWidth === "undefined") {
      this.options.minColWidth = width;
    }
    return this;
  }

  /**
   * Set table indentation.
   * @param width     Indent width.
   * @param override  Override existing value.
   */
  public indent(width: number, override = true): this {
    if (override || typeof this.options.indent === "undefined") {
      this.options.indent = width;
    }
    return this;
  }

  /**
   * Set cell padding.
   * @param padding   Cell padding.
   * @param override  Override existing value.
   */
  public padding(padding: number | number[], override = true): this {
    if (override || typeof this.options.padding === "undefined") {
      this.options.padding = padding;
    }
    return this;
  }

  /**
   * Enable/disable cell border.
   * @param enable    Enable/disable cell border.
   * @param override  Override existing value.
   */
  public border(enable = true, override = true): this {
    if (override || typeof this.options.border === "undefined") {
      this.options.border = enable;
    }
    return this;
  }

  /**
   * Align table content.
   * @param direction Align direction.
   * @param override  Override existing value.
   */
  public align(direction: Direction, override = true): this {
    if (override || typeof this.options.align === "undefined") {
      this.options.align = direction;
    }
    return this;
  }

  /**
   * Set border characters.
   * @param chars Border options.
   */
  public chars(chars: BorderOptions): this {
    Object.assign(this.options.chars, chars);
    return this;
  }

  /**
   * Register header value parser.
   * @param fn  Value parser callback function.
   */
  public headerValue(fn: ValueParser<GetRowValue<THeaderRow>>): this {
    this.options.headerValue = fn;
    return this;
  }

  /**
   * Register cell value parser.
   * @param fn  Value parser callback function.
   */
  public cellValue(fn: ValueParser<GetRowValue<TRow>>): this {
    this.options.cellValue = fn;
    return this;
  }

  /**
   * Register header renderer. Will be called once for each line in the cell.
   * @param fn  Cell renderer callback function.
   */
  public headerRenderer(fn: Renderer): this {
    this.options.headerRenderer = fn;
    return this;
  }

  /**
   * Register cell renderer. Will be called once for each line in the cell.
   * @param fn  Cell renderer callback function.
   */
  public cellRenderer(fn: Renderer): this {
    this.options.cellRenderer = fn;
    return this;
  }

  /** Get table header. */
  public getHeader(): Row<GetRowValue<THeaderRow>> | undefined {
    return this.headerRow;
  }

  /** Get table body. */
  public getBody(): TRow[] {
    return [...this];
  }

  /** Get max col width. */
  public getMaxColWidth(): number | number[] {
    return this.options.maxColWidth;
  }

  /** Get min col width. */
  public getMinColWidth(): number | number[] {
    return this.options.minColWidth;
  }

  /** Get table indentation. */
  public getIndent(): number {
    return this.options.indent;
  }

  /** Get cell padding. */
  public getPadding(): number | number[] {
    return this.options.padding;
  }

  /** Check if table has border. */
  public getBorder(): boolean | undefined {
    return this.options.border;
  }

  /** Check if header row has border. */
  public hasHeaderBorder(): boolean {
    const hasBorder = this.headerRow?.hasBorder();
    return hasBorder === true ||
      (this.getBorder() === true && hasBorder !== false);
  }

  /** Check if table bordy has border. */
  public hasBodyBorder(): boolean {
    return this.getBorder() ||
      this.options.columns.some((column) => column.getBorder()) ||
      this.some((row) =>
        row instanceof Row
          ? row.hasBorder()
          : Array.isArray(row)
          ? row.some((cell) => cell instanceof Cell ? cell.getBorder() : false)
          : false
      );
  }

  /** Check if table header or body has border. */
  public hasBorder(): boolean {
    return this.hasHeaderBorder() || this.hasBodyBorder();
  }

  /** Get table alignment. */
  public getAlign(): Direction | undefined {
    return this.options.align;
  }

  /** Get column definitions. */
  public getColumns(): Array<
    Column<GetRowValue<TRow>, GetRowValue<THeaderRow>>
  > {
    return this.options.columns;
  }

  /** Get column definition by column index. */
  public getColumn(
    index: number,
  ): Column<GetRowValue<TRow>, GetRowValue<THeaderRow>> {
    return this.options.columns[index] ??= new Column();
  }

  /** Get header value parser. */
  public getHeaderValueParser():
    | ValueParser<GetRowValue<THeaderRow>>
    | undefined {
    return this.options.headerValue;
  }

  /** Get value parser. */
  public getCellValueParser(): ValueParser<GetRowValue<TRow>> | undefined {
    return this.options.cellValue;
  }

  /** Get header renderer. */
  public getHeaderRenderer(): Renderer | undefined {
    return this.options.headerRenderer;
  }

  /** Get cell renderer. */
  public getCellRenderer(): Renderer | undefined {
    return this.options.cellRenderer;
  }

  fillRows(enable = true): this {
    this.options.isDataTable = enable;
    return this;
  }
}
