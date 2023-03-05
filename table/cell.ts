/** Cell type */
export type CellValue = number | string;

export type CellType = CellValue | Cell;

export type Direction = "left" | "right" | "center";

/** Cell options. */
export interface CellOptions {
  border?: boolean;
  colSpan?: number;
  rowSpan?: number;
  align?: Direction;
}

/** Cell representation. */
export class Cell {
  protected options: CellOptions = {};

  /** Get cell length. */
  public get length(): number {
    return this.toString().length;
  }

  /**
   * Create a new cell. If value is a cell, the value and all options of the cell
   * will be copied to the new cell.
   * @param value Cell or cell value.
   */
  public static from(value: CellType): Cell {
    let cell: Cell;
    if (value instanceof Cell) {
      cell = new this(value.getValue());
      cell.options = { ...value.options };
    } else {
      cell = new this(value);
    }
    return cell;
  }

  /**
   * Cell constructor.
   * @param value Cell value.
   */
  public constructor(private value: CellValue) {}

  /** Get cell string value. */
  public toString(): string {
    return this.value.toString();
  }

  /** Get cell value. */
  public getValue(): CellValue {
    return this.value;
  }

  /**
   * Set cell value.
   * @param value Cell or cell value.
   */
  public setValue(value: CellValue): this {
    this.value = value;
    return this;
  }

  /**
   * Clone cell with all options.
   * @param value Cell or cell value.
   */
  public clone(value?: CellValue): Cell {
    return Cell.from(value ?? this);
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
   * Set col span.
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
   * Getter:
   */

  /** Check if cell has border. */
  public getBorder(): boolean {
    return this.options.border === true;
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

  /** Get row span. */
  public getAlign(): Direction {
    return this.options.align ?? "left";
  }
}
