import { CellValue, Direction, ValueParser } from "./cell.ts";

/** Column options. */
export interface ColumnOptions<
  TValue extends CellValue,
  THeaderValue extends CellValue = TValue,
> {
  /** Enable/disable cell border. */
  border?: boolean;
  /** Cell cell alignment direction. */
  align?: Direction;
  /** Set min column width. */
  minWidth?: number;
  /** Set max column width. */
  maxWidth?: number;
  /** Set cell padding. */
  padding?: number;
  headerValue?: ValueParser<THeaderValue>;
  value?: ValueParser<TValue>;
}

/**
 * Column representation.
 *
 * Can be used to customize a single column.
 *
 * ```ts
 * import { Column, Table } from "./mod.ts";
 *
 * new Table()
 *   .header(["One", "Two"])
 *   .body([
 *     ["Foo", "bar"],
 *     ["Beep", "Boop"],
 *   ])
 *   .column(0, new Column({
 *     border: true,
 *   }))
 *   .render();
 * ```
 */
export class Column<
  TValue extends CellValue,
  THeaderValue extends CellValue = TValue,
> {
  /**
   * Create a new column from column options or an existing column.
   * @param options
   */
  static from<
    TValue extends CellValue,
    THeaderValue extends CellValue,
  >(
    options: ColumnOptions<TValue, THeaderValue> | Column<TValue, THeaderValue>,
  ): Column<TValue, THeaderValue> {
    const opts = options instanceof Column ? options.opts : options;
    return new Column<TValue, THeaderValue>().options(opts);
  }

  constructor(
    protected opts: ColumnOptions<TValue, THeaderValue> = {},
  ) {}

  /**
   * Set column options.
   * @param options Column options.
   */
  options(options: ColumnOptions<TValue, THeaderValue>): this {
    Object.assign(this.opts, options);
    return this;
  }

  /**
   * Set min column width.
   * @param width Min column width.
   */
  minWidth(width: number): this {
    this.opts.minWidth = width;
    return this;
  }

  /**
   * Set max column width.
   * @param width Max column width.
   */
  maxWidth(width: number): this {
    this.opts.maxWidth = width;
    return this;
  }

  /**
   * Set column border.
   * @param border
   */
  border(border = true): this {
    this.opts.border = border;
    return this;
  }

  /**
   * Set column left and right padding.
   * @param padding Padding.
   */
  padding(padding: number): this {
    this.opts.padding = padding;
    return this;
  }

  /**
   * Set column alignment.
   * @param direction Column alignment.
   */
  align(direction: Direction): this {
    this.opts.align = direction;
    return this;
  }

  /**
   * Register header value parser.
   * @param fn  Value parser callback function.
   */
  headerValue(fn: ValueParser<THeaderValue>): this {
    this.opts.headerValue = fn;
    return this;
  }

  /**
   * Register cell value parser.
   * @param fn  Value parser callback function.
   */
  value(fn: ValueParser<TValue>): this {
    this.opts.value = fn;
    return this;
  }

  /** Get min column width. */
  getMinWidth(): number | undefined {
    return this.opts.minWidth;
  }

  /** Get max column width. */
  getMaxWidth(): number | undefined {
    return this.opts.maxWidth;
  }

  /** Get column border. */
  getBorder(): boolean | undefined {
    return this.opts.border;
  }

  /** Get column padding. */
  getPadding(): number | undefined {
    return this.opts.padding;
  }

  /** Get column alignment. */
  getAlign(): Direction | undefined {
    return this.opts.align;
  }

  /** Get header value parser. */
  getHeaderValueParser(): ValueParser<THeaderValue> | undefined {
    return this.opts.headerValue;
  }

  /** Get value parser. */
  getCellValueParser(): ValueParser<TValue> | undefined {
    return this.opts.value;
  }
}
