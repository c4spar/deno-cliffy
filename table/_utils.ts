/**
 * Get next words from the beginning of [content] until all words have a length lower or equal then [length].
 *
 * @param length    Max length of all words.
 * @param content   The text content.
 */
import { Cell, CellType } from "./cell.ts";
import { consumeWords } from "./consume_words.ts";
import { stripColor } from "./deps.ts";

/**
 * Get longest cell from given row index.
 */
export function longest(
  index: number,
  rows: Array<Array<CellType>>,
  maxWidth?: number,
): number {
  const cellLengths = rows.map((row) => {
    const cell = row[index];
    const cellValue = cell instanceof Cell && cell.getColSpan() > 1
      ? ""
      : cell?.toString() || "";

    return cellValue
      .split("\n")
      .map((line: string) => {
        const str = typeof maxWidth === "undefined"
          ? line
          : consumeWords(maxWidth, line);

        return strLength(str) || 0;
      });
  }).flat();

  return Math.max(...cellLengths);
}

export const strLength = (str: string): number => {
  str = stripColor(str);
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (
      // chinese characters: \u4e00 - \u9fa5
      (charCode >= 19968 && charCode <= 40869) ||
      // japanese characters \u3040 - \u30ff
      (charCode >= 12352 && charCode <= 12543) ||
      // full width characters \uff00 - \uffef
      (charCode >= 65280 && charCode <= 65519) ||
      // cjk symbol and punctuation characters \u3000 - \u303f
      (charCode >= 12288 && charCode <= 12351)
    ) {
      length += 2;
    } else {
      length += 1;
    }
  }
  return length;
};
