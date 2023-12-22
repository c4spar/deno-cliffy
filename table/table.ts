import { Border, border } from "./border.ts";
import {
  Cell,
  CellValue,
  Direction,
  GetCellValue,
  ValueParser,
} from "./cell.ts";
import { Column, ColumnOptions } from "./column.ts";
import { TableLayout } from "./_layout.ts";
import {
  GetRowInnerValue,
  GetRowValue,
  Row,
  RowType,
  UnwrapRow,
} from "./row.ts";

/**
 * Table representation.
 *
 * ```ts
 * import { Row, Table } from "./mod.ts";
 *
 * new Table()
 *   .header(new Row("Name", "Date", "City", "Country").border())
 *   .body([
 *     ["Baxter Herman", "Oct 1, 2020", "Harderwijk", "Slovenia"],
 *     ["Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan"],
 *     ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
 *     ["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"],
 *   ])
 *   .render();
 * ```
 */
export class Table<
  TRow extends RowType<CellValue>,
  THeaderRow extends RowType<CellValue> = TRow,
> extends Array<TRow> {
  protected static _chars: Border = { ...border };
  protected options: TableSettings<TRow, THeaderRow> = {
    indent: 0,
    border: false,
    maxColWidth: Infinity,
    minColWidth: 0,
    padding: 1,
    chars: { ...Table._chars },
    columns: [] as Array<unknown> as Columns<TRow, THeaderRow>,
  };
  private headerRow?: Row<GetRowValue<THeaderRow>>;

  /**
   * Create a new table. If rows is a table, all rows and options of the table
   * will be copied to the new table.
   *
   * @param rows An array of rows or a table instance.
   */
  public static from<
    TRow extends RowType<CellValue>,
    THeaderRow extends RowType<CellValue>,
  >(
    rows: TableType<TRow, THeaderRow>,
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
   *
   * @param rows Array of objects.
   */
  public static fromJson<TValue extends CellValue>(
    rows: Array<Record<string, TValue>>,
  ): Table<Array<TValue>, Array<string>> {
    return new this().fromJson(rows);
  }

  /**
   * Set global default border characters.
   *
   * @param chars Border options.
   */
  public static chars(chars: BorderOptions): typeof Table {
    Object.assign(this._chars, chars);
    return this;
  }

  /**
   * Write table or rows to stdout.
   *
   * @param rows Table or rows.
   */
  public static render<
    TRow extends RowType<CellValue>,
    THeaderRow extends RowType<CellValue>,
  >(
    rows: Array<TRow> | Table<TRow, THeaderRow>,
  ): void {
    Table.from(rows).render();
  }

  /**
   * Read data from an array of json objects. An object represents a
   * row and each property a column.
   *
   * @param rows Array of objects.
   */
  public fromJson<TValue extends CellValue>(
    rows: Array<Record<string, TValue>>,
  ): Table<Array<TValue>, Array<string>> {
    return (this as Table<unknown> as Table<Array<TValue>, Array<string>>)
      .header(Object.keys(rows[0]))
      .body(rows.map((row) => Object.values(row)));
  }

  /**
   * Set column options.
   *
   * @param columns Array of columns or column options.
   */
  public columns(
    columns: ColumnsOptions<TRow, THeaderRow>,
  ): this {
    this.options.columns = columns.map((column) =>
      column instanceof Column ? column : Column.from(column)
    ) as Columns<TRow, THeaderRow>;
    return this;
  }

  /**
   * Set column options by index.
   *
   @param index   The column index.
   @param column  Column or column options.
   */
  public column<TIndex extends number>(
    index: TIndex,
    column:
      | Columns<TRow, THeaderRow>[TIndex]
      | ColumnsOptions<TRow, THeaderRow>[TIndex],
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
   *
   * @param header Header row or cells.
   */
  public header<const THeader extends THeaderRow>(
    header: THeader,
  ): Table<TRow, THeader> {
    this.headerRow = header instanceof Row
      ? header
      : Row.from(header) as Row<GetRowValue<THeaderRow>>;
    return this as Table<unknown> as Table<TRow, THeader>;
  }

  /**
   * Add an array of rows.
   * @param rows Table rows.
   */
  public rows<const TBodyRow extends TRow>(
    rows: Array<TBodyRow>,
  ): Table<TRow | TBodyRow, THeaderRow> {
    const table = this as Table<RowType<CellValue>, THeaderRow> as Table<
      TBodyRow,
      THeaderRow
    >;
    table.push(...rows);
    return table as Table<TRow | TBodyRow, THeaderRow>;
  }

  /**
   * Set table body.
   *
   * @param rows Array of rows.
   */
  public body<const TBodyRow extends TRow>(
    rows: Array<TBodyRow>,
  ): Table<TBodyRow, THeaderRow> {
    this.length = 0;
    return this.rows(rows) as Table<TBodyRow, THeaderRow>;
  }

  /** Clone table recursively with header and options. */
  public clone(): Table<TRow, THeaderRow> {
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
   * Set max column width.
   *
   * @param width     Max column width.
   * @param override  Override existing value.
   */
  public maxColWidth(width: number | Array<number>, override = true): this {
    if (override || typeof this.options.maxColWidth === "undefined") {
      this.options.maxColWidth = width;
    }
    return this;
  }

  /**
   * Set min column width.
   *
   * @param width     Min column width.
   * @param override  Override existing value.
   */
  public minColWidth(width: number | Array<number>, override = true): this {
    if (override || typeof this.options.minColWidth === "undefined") {
      this.options.minColWidth = width;
    }
    return this;
  }

  /**
   * Set table indentation.
   *
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
   *
   * @param padding   Cell padding.
   * @param override  Override existing value.
   */
  public padding(padding: number | Array<number>, override = true): this {
    if (override || typeof this.options.padding === "undefined") {
      this.options.padding = padding;
    }
    return this;
  }

  /**
   * Enable/disable cell border.
   *
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
   *
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
   *
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
  public headerValue(
    fn: ValueParser<GetRowInnerValue<THeaderRow>>,
  ): this {
    this.options.headerValue = fn;
    return this;
  }

  /**
   * Register cell value parser.
   * @param fn  Value parser callback function.
   */
  public value(fn: ValueParser<GetRowInnerValue<TRow>>): this {
    this.options.value = fn;
    return this;
  }

  /** Get table header. */
  public getHeader(): Row<GetRowValue<THeaderRow>> | undefined {
    return this.headerRow;
  }

  /** Get table body. */
  public getBody(): Array<TRow> {
    return [...this];
  }

  /** Get max column width. */
  public getMaxColWidth(): number | Array<number> {
    return this.options.maxColWidth;
  }

  /** Get min column width. */
  public getMinColWidth(): number | Array<number> {
    return this.options.minColWidth;
  }

  /** Get table indentation. */
  public getIndent(): number {
    return this.options.indent;
  }

  /** Get cell padding. */
  public getPadding(): number | Array<number> {
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

  /** Get columns. */
  public getColumns(): Columns<TRow, THeaderRow> {
    return this.options.columns;
  }

  /** Get column by index. */
  public getColumn<TIndex extends number>(
    index: TIndex,
  ): Columns<TRow, THeaderRow>[TIndex] {
    return this.options.columns[index] ??= new Column();
  }

  /** Get header value parser. */
  public getHeaderValueParser():
    | ValueParser<GetRowInnerValue<THeaderRow>>
    | undefined {
    return this.options.headerValue;
  }

  /** Get value parser. */
  public getValueParser():
    | ValueParser<GetRowInnerValue<TRow>>
    | undefined {
    return this.options.value;
  }
}

/** Table settings. */
export interface TableSettings<
  TRow extends RowType<CellValue>,
  THeaderRow extends RowType<CellValue> = TRow,
> {
  /** Table indentation. */
  indent: number;
  /** Enable/disable border on all cells. */
  border: boolean;
  /** Set min column width. */
  minColWidth: number | Array<number>;
  /** Set max column width. */
  maxColWidth: number | Array<number>;
  /** Set cell padding. */
  padding: number | Array<number>;
  /** Set table characters. */
  chars: Border;
  /** Set cell content alignment. */
  align?: Direction;
  /** Set column options. */
  columns: Columns<TRow, THeaderRow>;
  /** Header value parser */
  headerValue?: ValueParser<GetRowInnerValue<THeaderRow>>;
  /** Cell value parser */
  value?: ValueParser<GetRowInnerValue<TRow>>;
}

/** Table type. */
export type TableType<
  TRow extends RowType<CellValue>,
  THeaderRow extends RowType<CellValue> = TRow,
> =
  | Array<TRow>
  | Table<TRow, THeaderRow>;

/** Border characters settings. */
export type BorderOptions = Partial<Border>;

type Columns<
  TRow extends RowType<CellValue>,
  THeaderRow extends RowType<CellValue> = TRow,
> = GetRow<UnwrapRow<TRow>, UnwrapRow<THeaderRow>> extends infer Row
  ? [] extends Row
    ? Array<Column<GetRowInnerValue<TRow>, GetRowInnerValue<THeaderRow>>>
    // deno-lint-ignore ban-types
  : {} extends Row
    ? Array<Column<GetRowInnerValue<TRow>, GetRowInnerValue<THeaderRow>>>
  : {
    [TIndex in keyof Row]?: Column<
      GetCellValue<GetCell<TRow, TIndex>>,
      GetCellValue<GetCell<THeaderRow, TIndex>>
    >;
  }
  : never;

type ColumnsOptions<
  TRow extends RowType<CellValue>,
  THeaderRow extends RowType<CellValue> = TRow,
> = GetRow<UnwrapRow<TRow>, UnwrapRow<THeaderRow>> extends infer Row
  ? [] extends Row
    ? Array<ColumnOptions<GetRowInnerValue<TRow>, GetRowInnerValue<THeaderRow>>>
    // deno-lint-ignore ban-types
  : {} extends Row
    ? Array<ColumnOptions<GetRowInnerValue<TRow>, GetRowInnerValue<THeaderRow>>>
  : {
    [TIndex in keyof Row]?: ColumnOptions<
      GetCellValue<GetCell<TRow, TIndex>>,
      GetCellValue<GetCell<THeaderRow, TIndex>>
    >;
  }
  : never;

type GetRow<
  TRow,
  THeaderRow,
> = TRow extends ReadonlyArray<unknown>
  ? THeaderRow extends ReadonlyArray<unknown> ? TRow | THeaderRow
  : TRow
  : THeaderRow extends ReadonlyArray<unknown> ? THeaderRow
  : MakeArray<TRow> | MakeArray<THeaderRow>;

type GetCell<TRow, TIndex> = TIndex extends keyof TRow ? TRow[TIndex]
  : TRow extends ReadonlyArray<unknown> ? TRow[number]
  : TRow;

type MakeArray<T> = unknown extends T ? []
  : T extends ReadonlyArray<unknown> ? T
  : ReadonlyArray<T>;

/** @deprecated Use `BorderOptions` instead. */
export type IBorderOptions = BorderOptions;

/** @deprecated Use `TableType` instead. */
export type ITable<
  TRow extends RowType<CellValue> = RowType<CellValue>,
  THeaderRow extends RowType<CellValue> = TRow,
> = TableType<TRow, THeaderRow>;
