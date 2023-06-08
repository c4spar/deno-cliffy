import { Direction } from "./cell.ts";

export interface ColumnOptions {
  border?: boolean;
  align?: Direction;
  minWidth?: number;
  maxWidth?: number;
  padding?: number;
}

export class Column {
  static from(options: ColumnOptions): Column {
    const column = new Column();
    column.opts = { ...options };
    return column;
  }

  protected opts: ColumnOptions = {};

  /** Set column options. */
  options(options: ColumnOptions): this {
    Object.assign(this.opts, options);
    return this;
  }

  /** Set min column width. */
  minWidth(width: number): this {
    this.opts.minWidth = width;
    return this;
  }

  /** Set max column width. */
  maxWidth(width: number): this {
    this.opts.maxWidth = width;
    return this;
  }

  /** Set column border. */
  border(border = true): this {
    this.opts.border = border;
    return this;
  }

  /** Set column padding. */
  padding(padding: number): this {
    this.opts.padding = padding;
    return this;
  }

  /** Set column alignment. */
  align(direction: Direction): this {
    this.opts.align = direction;
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
}
