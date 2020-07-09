export type ICell = number | string | String | Cell;

export interface ICellOptions {
    border?: boolean;
}

export class Cell extends String {

    protected options: ICellOptions = {};

    public static from( value: ICell ): Cell {
        const cell = new this( value );
        if ( value instanceof Cell ) {
            cell.options = Object.assign( {}, value.options );
        }
        return cell;
    }

    public clone( value?: ICell ): Cell {
        const cell = new Cell( value ?? this );
        cell.options = Object.assign( {}, this.options );
        return cell;
    }

    /**
     * Setter:
     */

    public border( enable: boolean, override: boolean = true ): this {
        if ( override || typeof this.options.border === 'undefined' ) {
            this.options.border = enable;
        }
        return this;
    }

    /**
     * Getter:
     */

    public getBorder(): boolean {
        return this.options.border === true;
    }
}
