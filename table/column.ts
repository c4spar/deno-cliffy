export interface ColumnOptions {
  minWidth?: number;
  maxWidth?: number;
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

  width(width: number): this {
    return this.minWidth(width).maxWidth(width);
  }

  minWidth(width: number): this {
    this.opts.minWidth = width;
    return this;
  }

  maxWidth(width: number): this {
    this.opts.maxWidth = width;
    return this;
  }

  getMinWidth(): number | undefined {
    return this.opts.minWidth;
  }

  getMaxWidth(): number | undefined {
    return this.opts.maxWidth;
  }
}
