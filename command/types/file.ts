import { StringType } from "./string.ts";

export interface FileTypeOptions {
  dirsOnly?: boolean;
  pattern?: string;
  ignore?: Array<string>;
}

/** Integer type. */
export class FileType extends StringType {
  constructor(private readonly opts: FileTypeOptions = {}) {
    super();
  }

  // getOptions(): FileTypeOptions {
  //   return this.opts;
  // }
}
