import { Border, border } from "./border.ts";
import { Cell, Direction } from "./cell.ts";
import { Column, ColumnOptions } from "./column.ts";
import { TableLayout } from "./layout.ts";
import { DataRow, Row, RowType } from "./row.ts";

/** Border characters settings. */
export type BorderOptions = Partial<Border>;

/** Table settings. */
export interface TableSettings {
  indent: number;
  border: boolean;
  maxColWidth: number | Array<number>;
  minColWidth: number | Array<number>;
  padding: number | Array<number>;
  chars: Border;
  align?: Direction;
  columns: Array<Column>;
}

/** Table type. */
export type TableType<TRow extends RowType = RowType> =
  | Array<TRow>
  | Table<TRow>;

/** Table representation. */
export class Table<TRow extends RowType = RowType> extends Array<TRow> {
  protected static _chars: Border = { ...border };
  protected options: TableSettings = {
    indent: 0,
    border: false,
    maxColWidth: Infinity,
    minColWidth: 0,
    padding: 1,
    chars: { ...Table._chars },
    columns: [],
  };
  private headerRow?: Row;

  /**
   * Create a new table. If rows is a table, all rows and options of the table
   * will be copied to the new table.
   * @param rows
   */
  public static from<TRow extends RowType>(rows: TableType<TRow>): Table<TRow> {
    const table = new this(...rows);
    if (rows instanceof Table) {
      table.options = { ...(rows as Table).options };
      table.headerRow = rows.headerRow ? Row.from(rows.headerRow) : undefined;
    }
    return table;
  }

  /**
   * Create a new table from an array of json objects. An object represents a
   * row and each property a column.
   * @param rows Array of objects.
   */
  public static fromJson(rows: Array<DataRow>): Table {
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
  public static render<TRow extends RowType>(rows: TableType<TRow>): void {
    Table.from(rows).render();
  }

  /**
   * Read data from an array of json objects. An object represents a
   * row and each property a column.
   * @param rows Array of objects.
   */
  public fromJson(rows: Array<DataRow>): this {
    this.header(Object.keys(rows[0]));
    this.body(rows.map((row) => Object.values(row) as TRow));
    return this;
  }

  public columns(columns: Array<Column | ColumnOptions>): this {
    this.options.columns = columns.map((column) =>
      column instanceof Column ? column : Column.from(column)
    );
    return this;
  }

  public column(
    index: number,
    column: Column | ColumnOptions,
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
  public header(header: RowType): this {
    this.headerRow = header instanceof Row ? header : Row.from(header);
    return this;
  }

  /**
   * Set table body.
   * @param rows Table rows.
   */
  public body(rows: Array<TRow>): this {
    this.length = 0;
    this.push(...rows);
    return this;
  }

  /** Clone table recursively with header and options. */
  public clone(): Table {
    const table = new Table(
      ...this.map((row: TRow) =>
        row instanceof Row ? row.clone() : Row.from(row).clone()
      ),
    );
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
  public maxColWidth(width: number | Array<number>, override = true): this {
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
  public minColWidth(width: number | Array<number>, override = true): this {
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
  public padding(padding: number | Array<number>, override = true): this {
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

  /** Get table header. */
  public getHeader(): Row | undefined {
    return this.headerRow;
  }

  /** Get table body. */
  public getBody(): Array<TRow> {
    return [...this];
  }

  /** Get mac col widrth. */
  public getMaxColWidth(): number | Array<number> {
    return this.options.maxColWidth;
  }

  /** Get min col width. */
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
  public getBorder(): boolean {
    return this.options.border === true;
  }

  /** Check if header row has border. */
  public hasHeaderBorder(): boolean {
    const hasBorder = this.headerRow?.hasBorder();
    return hasBorder === true || (this.getBorder() && hasBorder !== false);
  }

  /** Check if table bordy has border. */
  public hasBodyBorder(): boolean {
    return this.getBorder() ||
      this.options.columns.some((column) => column.getBorder()) ||
      this.some((row) =>
        row instanceof Row
          ? row.hasBorder()
          : row.some((cell) => cell instanceof Cell ? cell.getBorder() : false)
      );
  }

  /** Check if table header or body has border. */
  public hasBorder(): boolean {
    return this.hasHeaderBorder() || this.hasBodyBorder();
  }

  /** Get table alignment. */
  public getAlign(): Direction {
    return this.options.align ?? "left";
  }

  public getColumns(): Array<Column> {
    return this.options.columns;
  }

  public getColumn(index: number): Column {
    return this.options.columns[index] ??= new Column();
  }
}

/** @deprecated Use `BorderOptions` instead. */
export type IBorderOptions = BorderOptions;

/** @deprecated Use `TableType` instead. */
export type ITable = TableType;
