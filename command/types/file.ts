import { StringType } from "./string.ts";

// export interface FileTypeOptions {
//   dirsOnly?: boolean;
//   pattern?: string;
//   ignore?: Array<string>;
// }

/** Integer type. */
export class FileType<TType extends string> extends StringType<TType> {
  constructor() {
    super();
  }

  // getOptions(): FileTypeOptions {
  //   return this.opts;
  // }
}
