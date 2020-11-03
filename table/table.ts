import { border, IBorder } from "./border.ts";
import { Cell } from "./cell.ts";
import { TableLayout } from "./layout.ts";
import { IDataRow, IRow, Row } from "./row.ts";

export type IBorderOptions = Partial<IBorder>;

export interface ITableOptions {
  indent?: number;
  border?: boolean;
  maxColWidth?: number | number[];
  minColWidth?: number | number[];
  padding?: number | number[];
  chars?: IBorderOptions;
}

export interface ITableSettings extends Required<ITableOptions> {
  chars: IBorder;
}

export type ITable<T extends IRow = IRow> = T[] | Table<T>;

export class Table<T extends IRow = IRow> extends Array<T> {
  protected static _chars: IBorder = border;
  protected options: ITableSettings = {
    indent: 0,
    border: false,
    maxColWidth: Infinity,
    minColWidth: 0,
    padding: 1,
    chars: Object.assign({}, Table._chars),
  };
  private headerRow?: Row;

  public static from<T extends IRow>(rows: ITable<T>): Table<T> {
    const table = new this(...rows);
    if (rows instanceof Table) {
      table.options = Object.assign({}, rows.options);
      table.headerRow = rows.headerRow ? Row.from(rows.headerRow) : undefined;
    }
    return table;
  }

  public static fromJson(rows: IDataRow[]): Table {
    return new this().fromJson(rows);
  }

  /** Set global default border characters. */
  public static chars(chars: IBorderOptions): typeof Table {
    Object.assign(this._chars, chars);
    return this;
  }

  public static render<T extends IRow>(rows: ITable<T>): void {
    Table.from(rows).render();
  }

  public fromJson(rows: IDataRow[]): this {
    this.header(Object.keys(rows[0]));
    this.body(rows.map((row) => Object.values(row) as T));
    return this;
  }

  public header(header: IRow): this {
    this.headerRow = header instanceof Row ? header : Row.from(header);
    return this;
  }

  public body(rows: T[]): this {
    this.length = 0;
    this.push(...rows);
    return this;
  }

  public clone(): Table {
    const table = new Table(
      ...this.map((row: T) =>
        row instanceof Row ? row.clone() : Row.from(row).clone(),
      ),
    );
    table.options = Object.assign({}, this.options);
    table.headerRow = this.headerRow?.clone();
    return table;
  }

  public toString(): string {
    return new TableLayout(this, this.options).toString();
  }

  public render(): this {
    Deno.stdout.writeSync(new TextEncoder().encode(this.toString() + "\n"));
    return this;
  }

  public maxColWidth(width: number | number[], override = true): this {
    if (override || typeof this.options.maxColWidth === "undefined") {
      this.options.maxColWidth = width;
    }
    return this;
  }

  public minColWidth(width: number | number[], override = true): this {
    if (override || typeof this.options.minColWidth === "undefined") {
      this.options.minColWidth = width;
    }
    return this;
  }

  public indent(width: number, override = true): this {
    if (override || typeof this.options.indent === "undefined") {
      this.options.indent = width;
    }
    return this;
  }

  public padding(padding: number | number[], override = true): this {
    if (override || typeof this.options.padding === "undefined") {
      this.options.padding = padding;
    }
    return this;
  }

  public border(enable: boolean, override = true): this {
    if (override || typeof this.options.border === "undefined") {
      this.options.border = enable;
    }
    return this;
  }

  public chars(chars: IBorderOptions): this {
    Object.assign(this.options.chars, chars);
    return this;
  }

  public getHeader(): Row | undefined {
    return this.headerRow;
  }

  public getBody(): T[] {
    return this.slice();
  }

  public getMaxColWidth(): number | number[] {
    return this.options.maxColWidth;
  }

  public getMinColWidth(): number | number[] {
    return this.options.minColWidth;
  }

  public getIndent(): number {
    return this.options.indent;
  }

  public getPadding(): number | number[] {
    return this.options.padding;
  }

  public getBorder(): boolean {
    return this.options.border === true;
  }

  public hasHeaderBorder(): boolean {
    return this.getBorder() || (
      this.headerRow instanceof Row && this.headerRow.hasBorder()
    );
  }

  public hasBodyBorder(): boolean {
    return this.getBorder() ||
      this.some((row) =>
        row instanceof Row
          ? row.hasBorder()
          : row.some((cell) => cell instanceof Cell ? cell.getBorder : false),
      );
  }

  public hasBorder(): boolean {
    return this.hasHeaderBorder() || this.hasBodyBorder();
  }
}
