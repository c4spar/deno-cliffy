import { Direction, Renderer, ValueParser } from "./cell.ts";

export interface ColumnOptions {
  border?: boolean;
  align?: Direction;
  minWidth?: number;
  maxWidth?: number;
  padding?: number;
  headerValue?: ValueParser;
  cellValue?: ValueParser;
  headerRenderer?: Renderer;
  cellRenderer?: Renderer;
}

export class Column {
  /**
   * Create column from existing column or column options.
   * @param options Column options.
   */
  static from(options: ColumnOptions | Column): Column {
    const column = new Column();
    column.opts = { ...options instanceof Column ? options.opts : options };
    return column;
  }

  constructor(
    protected opts: ColumnOptions = {},
  ) {}

  /**
   * Set column options.
   * @param options Column options.
   */
  options(options: ColumnOptions): this {
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
  headerValue(fn: ValueParser): this {
    this.opts.headerValue = fn;
    return this;
  }

  /**
   * Register cell value parser.
   * @param fn  Value parser callback function.
   */
  cellValue(fn: ValueParser): this {
    this.opts.cellValue = fn;
    return this;
  }

  /**
   * Register header cell renderer. Will be called once for each line in the cell.
   * @param fn  Cell renderer callback function.
   */
  headerRenderer(fn: Renderer): this {
    this.opts.headerRenderer = fn;
    return this;
  }

  /**
   * Register cell renderer. Will be called once for each line in the cell.
   * @param fn  Cell renderer callback function.
   */
  cellRenderer(fn: Renderer): this {
    this.opts.cellRenderer = fn;
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
  getHeaderValueParser(): ValueParser | undefined {
    return this.opts.headerValue;
  }

  /** Get value parser. */
  getCellValueParser(): ValueParser | undefined {
    return this.opts.cellValue;
  }

  /** Get header renderer. */
  getHeaderRenderer(): Renderer | undefined {
    return this.opts.headerRenderer;
  }

  /** Get cell renderer. */
  getCellRenderer(): Renderer | undefined {
    return this.opts.cellRenderer;
  }
}
