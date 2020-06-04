import { ICell } from "./cell.ts";

export type IRow<T = ICell> = T[] | Row<T>;

export interface IRowOptions {
  indent?: number;
  border?: boolean;
}

export class Row<T = ICell> extends Array<T> {
  protected options: IRowOptions = {};

  public static from<T = ICell>(row: IRow<T>): Row<T> {
    if (row instanceof Row) {
      return row.clone();
    }
    return new Row(...row);
  }

  public clone(): Row<T> {
    const clone = new Row(...this);
    clone.options = Object.create(this.options);
    return clone;
  }

  /**
     * Setter:
     */

  public border(enable: boolean, override: boolean = true): this {
    if (override || typeof this.options.border === "undefined") {
      this.options.border = enable;
    }
    return this;
  }

  /**
     * Getter:
     */

  public getBorder(defaultValue?: boolean): boolean | undefined {
    return this.options.border ?? defaultValue;
  }
}
