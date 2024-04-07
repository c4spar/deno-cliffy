import {
  Cell,
  CellType,
  CellValue,
  Direction,
  GetCellValue,
  ValueParser,
} from "./cell.ts";

/** Row type. */
export type RowType<TCell extends CellType> =
  | Row<TCell>
  | ReadonlyArray<TCell>
  | TCell;

export type GetRowInnerValue<TRow extends RowType<CellType>> = TRow extends
  infer TRow
  ? TRow extends ReadonlyArray<infer Value extends CellType>
    ? GetCellValue<Value>
  : TRow
  : never;

export type GetRowValue<TRow extends RowType<CellType>> = TRow extends
  infer TRow ? TRow extends ReadonlyArray<infer Value extends CellType> ? Value
  : TRow
  : never;

export type UnwrapRow<TRow extends RowType<CellType>> = TRow extends infer TRow
  ? TRow extends Row<infer Value extends CellType> ? Value
  : TRow
  : never;

/** @deprecated Use `Record<string, TValue>` instead. */
export type DataRow<TValue extends CellValue> = Record<string, TValue>;

/** Row options. */
export interface RowOptions<
  TValue extends CellValue,
> {
  indent?: number;
  border?: boolean;
  align?: Direction;
  value?: ValueParser<TValue>;
}

/**
 * Row representation.
 *
 * Can be used to customize a single row.
 *
 * ```ts
 * import { Row, Table } from "./mod.ts";
 *
 * new Table()
 *   .body([
 *     new Row("Foo", "Bar").align("right"),
 *     ["Beep", "Boop"],
 *   ])
 *   .render();
 * ```
 */
export class Row<
  TCell extends CellType,
> extends Array<TCell> {
  protected options: RowOptions<GetCellValue<TCell>> = {};

  /**
   * Create a new row. If cells is a row, all cells and options of the row will
   * be copied to the new row.
   *
   * @param value Cells or row.
   */
  public static from<
    TCell extends CellType,
  >(
    value: RowType<TCell>,
  ): Row<TCell> {
    if (Array.isArray(value)) {
      const row = new this<TCell>(...value);
      if (value instanceof Row) {
        row.options = { ...(value as Row<TCell>).options };
      }
      return row;
    }

    return new this(value as TCell);
  }

  /** Clone row recursively with all options. */
  public clone(): this {
    const cells = this.map((cell) =>
      cell instanceof Cell ? cell.clone() : cell
    );
    const row = Row.from(cells) as this;
    row.options = { ...this.options };
    return row;
  }

  /**
   * Setter:
   */

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
   * Align row content.
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
   * Register cell value parser.
   * @param fn  Value parser callback function.
   */
  public value(fn: ValueParser<GetCellValue<TCell>>): this {
    this.options.value = fn;
    return this;
  }

  /**
   * Getter:
   */

  /** Check if row has border. */
  public getBorder(): boolean | undefined {
    return this.options.border;
  }

  /** Check if row or any child cell has border. */
  public hasBorder(): boolean {
    return this.getBorder() ||
      this.some((cell) => cell instanceof Cell && cell.getBorder());
  }

  /** Get row alignment. */
  public getAlign(): Direction | undefined {
    return this.options.align;
  }

  /** Get value parser. */
  public getCellValueParser(): ValueParser<GetCellValue<TCell>> | undefined {
    return this.options.value;
  }
}

/** @deprecated Use `RowType` instead. */
export type IRow<TValue extends CellValue> = RowType<TValue>;

/** @deprecated Use `Record<string, TValue>` instead. */
export type IDataRow<TValue extends CellValue> = DataRow<TValue>;
