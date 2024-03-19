/** Allowed cell value type. */
export type CellValue = unknown;
// export type CellValue = number | string | Record<string, unknown> | undefined | null;

/** Cell type. */
export type CellType<TValue extends CellValue = CellValue> =
  | Cell<TValue>
  | TValue;

export type GetCellValue<TCell extends CellType> = TCell extends infer TCell
  ? TCell extends Cell<infer Value> ? Value
  : TCell
  : never;

/** Cell alignment direction. */
export type Direction = "left" | "right" | "center";

export type ValueParserResult = string | number | undefined | null | void;

export type ValueParser<TValue extends CellValue> = (
  value: TValue,
) => ValueParserResult;

/** Cell options. */
export interface CellOptions<TValue extends CellValue> {
  /** Enable/disable cell border. */
  border?: boolean;
  /** Set coll span. */
  colSpan?: number;
  /** Set row span. */
  rowSpan?: number;
  /** Cell cell alignment direction. */
  align?: Direction;
  value?: ValueParser<TValue>;
  /**
   * Any unterminated ANSI formatting overflowed from previous lines of a
   * multi-line cell.
   */
  unclosedAnsiRuns?: string;
}

/**
 * Cell representation.
 *
 * Can be used to customize a single cell.
 *
 * ```ts
 * import { Cell, Table } from "./mod.ts";
 *
 * new Table()
 *   .body([
 *     ["Foo", new Cell("Bar").align("right")],
 *     ["Beep", "Boop"],
 *   ])
 *   .render();
 * ```
 */
/** Cell representation. */
export class Cell<TValue extends CellValue = CellValue> {
  protected options: CellOptions<TValue> = {};

  /** Get cell length. */
  public get length(): number {
    return this.toString().length;
  }

  /**
   * Any unterminated ANSI formatting overflowed from previous lines of a
   * multi-line cell.
   */
  public get unclosedAnsiRuns(): string {
    return this.options.unclosedAnsiRuns ?? "";
  }
  public set unclosedAnsiRuns(val: string) {
    this.options.unclosedAnsiRuns = val;
  }

  /**
   * Create a new cell. If value is a cell, the value and all options of the cell
   * will be copied to the new cell.
   *
   * @param value Cell or cell value.
   */
  public static from<TValue extends CellValue>(
    value: CellType<TValue>,
  ): Cell<TValue> {
    if (value instanceof Cell) {
      const cell = new this(value.getValue());
      cell.options = { ...value.options };
      return cell;
    }

    return new this(value);
  }

  /**
   * Cell constructor.
   *
   * @param cellValue Cell value.
   */
  public constructor(
    private cellValue?: TValue | undefined | null,
  ) {}

  /** Get cell string value. */
  public toString(): string {
    return this.cellValue?.toString() ?? "";
  }

  /** Get cell value. */
  public getValue(): TValue | undefined | null {
    return this.cellValue;
  }

  /**
   * Set cell value.
   *
   * @param value Cell or cell value.
   */
  public setValue(value: TValue | undefined | null): this {
    this.cellValue = value;
    return this;
  }

  /**
   * Clone cell with all options.
   *
   * @param value Cell or cell value.
   */
  public clone<TCloneValue extends CellValue = TValue>(
    value?: TCloneValue,
  ): Cell<TCloneValue> {
    const cell = new Cell(value ?? this.getValue() as TCloneValue);
    cell.options = { ...this.options } as CellOptions<TCloneValue>;
    return cell;
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
   * Set col span.
   *
   * ```ts
   * import { Cell, Table } from "./mod.ts";
   *
   * new Table()
   *   .body([
   *     [
   *       new Cell("Row 1 & 2 Column 1").rowSpan(2),
   *       "Row 1 Column 2",
   *       "Row 1 Column 3",
   *     ],
   *     [new Cell("Row 2 Column 2 & 3").colSpan(2)],
   *   ])
   *   .border()
   *   .render();
   * ```
   *
   * @param span      Number of cols to span.
   * @param override  Override existing value.
   */
  public colSpan(span: number, override = true): this {
    if (override || typeof this.options.colSpan === "undefined") {
      this.options.colSpan = span;
    }
    return this;
  }

  /**
   * Set row span.
   *
   * ```ts
   * import { Cell, Table } from "./mod.ts";
   *
   * new Table()
   *   .body([
   *     [
   *       new Cell("Row 1 & 2 Column 1").rowSpan(2),
   *       "Row 1 Column 2",
   *       "Row 1 Column 3",
   *     ],
   *     [new Cell("Row 2 Column 2 & 3").colSpan(2)],
   *   ])
   *   .border()
   *   .render();
   * ```
   *
   * @param span      Number of rows to span.
   * @param override  Override existing value.
   */
  public rowSpan(span: number, override = true): this {
    if (override || typeof this.options.rowSpan === "undefined") {
      this.options.rowSpan = span;
    }
    return this;
  }

  /**
   * Align cell content.
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
  public value(fn: ValueParser<TValue>): this {
    this.options.value = fn;
    return this;
  }

  /**
   * Getter:
   */

  /** Check if cell has border. */
  public getBorder(): boolean | undefined {
    return this.options.border;
  }

  /** Get col span. */
  public getColSpan(): number {
    return typeof this.options.colSpan === "number" && this.options.colSpan > 0
      ? this.options.colSpan
      : 1;
  }

  /** Get row span. */
  public getRowSpan(): number {
    return typeof this.options.rowSpan === "number" && this.options.rowSpan > 0
      ? this.options.rowSpan
      : 1;
  }

  /** Get cell alignment. */
  public getAlign(): Direction | undefined {
    return this.options.align;
  }

  /** Get value parser. */
  public getValueParser(): ValueParser<TValue> | undefined {
    return this.options.value;
  }
}

/** @deprecated Use `CellType` instead. */
export type ICell = CellType;
