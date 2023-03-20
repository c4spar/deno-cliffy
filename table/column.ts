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

  options(options: ColumnOptions): this {
    Object.assign(this.opts, options);
    return this;
  }

  minWidth(width: number): this {
    this.opts.minWidth = width;
    return this;
  }

  maxWidth(width: number): this {
    this.opts.maxWidth = width;
    return this;
  }

  border(border = true): this {
    this.opts.border = border;
    return this;
  }

  padding(padding: number): this {
    this.opts.padding = padding;
    return this;
  }

  align(direction: Direction): this {
    this.opts.align = direction;
    return this;
  }

  getMinWidth(): number | undefined {
    return this.opts.minWidth;
  }

  getMaxWidth(): number | undefined {
    return this.opts.maxWidth;
  }

  getBorder(): boolean | undefined {
    return this.opts.border;
  }

  getPadding(): number | undefined {
    return this.opts.padding;
  }

  getAlign(): Direction | undefined {
    return this.opts.align;
  }
}
