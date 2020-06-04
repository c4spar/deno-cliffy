export type ICell = string | Cell;

export interface ICellOptions {
  border?: boolean;
}

export class Cell extends String {
  protected options: ICellOptions = {};

  public static from(cell: ICell): Cell {
    if (cell instanceof Cell) {
      return cell.clone();
    }
    return new this(cell);
  }

  public clone(value?: ICell): Cell {
    const clone = new Cell(value ?? this);
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
