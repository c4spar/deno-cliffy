import { Cell, Direction, ICell, Renderer, ValueParser } from "./cell.ts";

/** Row type */
export type IRow<T extends ICell | undefined = ICell | undefined> =
  | T[]
  | Row<T>;
/** Json row. */
export type IDataRow = Record<string, string | number>;

/** Row options. */
export interface IRowOptions {
  indent?: number;
  border?: boolean;
  align?: Direction;
  cellValue?: (
    value: string | number | undefined | null,
  ) => string | number | undefined | null;
  cellRenderer?: (value: string) => string;
}

/**
 * Row representation.
 */
export class Row<T extends ICell | undefined = ICell | undefined>
  extends Array<T> {
  protected options: IRowOptions = {};

  /**
   * Create a new row. If cells is a row, all cells and options of the row will
   * be copied to the new row.
   * @param cells Cells or row.
   */
  public static from<T extends ICell | undefined>(
    cells: IRow<T>,
  ): Row<T> {
    const row = new this(...cells);
    if (cells instanceof Row) {
      row.options = { ...(cells as Row).options };
    }
    return row;
  }

  /** Clone row recursively with all options. */
  public clone(): Row {
    const row = new Row(
      ...this.map((cell: T) => cell instanceof Cell ? cell.clone() : cell),
    );
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

  public cellValue(fn: ValueParser, override = true): this {
    if (override || typeof this.options.cellValue === "undefined") {
      this.options.cellValue = fn;
    }
    return this;
  }

  public cellRenderer(fn: Renderer, override = true): this {
    if (override || typeof this.options.cellRenderer === "undefined") {
      this.options.cellRenderer = fn;
    }
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

  public getCellValueParser(): ValueParser | undefined {
    return this.options.cellValue;
  }

  public getCellRenderer(): Renderer | undefined {
    return this.options.cellRenderer;
  }
}
