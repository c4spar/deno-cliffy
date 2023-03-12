import {
  Cell,
  CellOrValue,
  CellValue,
  Direction,
  GetCellValue,
  Renderer,
  ValueParser,
} from "./cell.ts";

/** Row type */
export type RowOrValue<TValue extends CellOrValue<CellValue>> =
  | TValue
  | Array<TValue>
  | Row<TValue>;

export type GetRowValue<TRow extends RowOrValue<CellOrValue<CellValue>>> =
  TRow extends infer TRow
    ? TRow extends Array<infer Value extends CellOrValue<CellValue>>
      ? GetCellValue<Value>
    : TRow extends CellOrValue<CellValue> ? GetCellValue<TRow>
    : never
    : never;

/** Json row. */
export type JsonData<TValue extends CellValue> = Record<string, TValue>;

/** Row options. */
export interface RowOptions<
  TValue extends CellValue,
> {
  indent?: number;
  border?: boolean;
  align?: Direction;
  cellValue?: ValueParser<TValue>;
  cellRenderer?: Renderer;
}

/**
 * Row representation.
 */
export class Row<
  TCell extends CellOrValue<CellValue>,
> extends Array<TCell> {
  protected options: RowOptions<GetCellValue<TCell>> = {};

  /**
   * Create a new row. If cells is a row, all cells and options of the row will
   * be copied to the new row.
   * @param value Cells or row.
   */
  public static from<
    TCell extends CellOrValue<CellValue>,
  >(
    value: RowOrValue<TCell>,
  ): Row<TCell> {
    if (Array.isArray(value)) {
      const row = new this<TCell>(...value);
      if (value instanceof Row) {
        row.options = { ...(value as Row<TCell>).options };
      }
      return row;
    }

    return new this(value);
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
  public cellValue(fn: ValueParser<GetCellValue<TCell>>): this {
    this.options.cellValue = fn;
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
    return this.options.cellValue;
  }

  /** Get cell renderer. */
  public getCellRenderer(): Renderer | undefined {
    return this.options.cellRenderer;
  }
}
