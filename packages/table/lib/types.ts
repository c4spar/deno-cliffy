/**
 * Table option's.
 */
export interface ITableOptions {
    header?: string[];
    padding?: number | number[];
    indent?: number;
    maxSize?: number | number[];
    minSize?: number | number[];
    rows: any[][];
}
