import { cursorPosition } from "./ansi_escapes.ts";
import type { ReaderSync, WriterSync } from "./deps.ts";

/** Cursor position. */
export interface Cursor {
  x: number;
  y: number;
}

/** Cursor position options. */
export interface CursorPositionOptions {
  writer?: WriterSync;
  reader?: ReaderSync & {
    setRaw(mode: boolean, options?: Deno.SetRawOptions): void;
    isTerminal(): boolean;
  };
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Get cursor position.
 *
 * @param options  Options.
 *
 * ```ts
 * import { Cursor, getCursorPosition } from "./mod.ts";
 *
 * const cursor: Cursor = getCursorPosition();
 * console.log(cursor); // { x: 0, y: 14}
 * ```
 */
export function getCursorPosition(
  {
    reader = Deno.stdin,
    writer = Deno.stdout,
  }: CursorPositionOptions = {},
): Cursor {
  const data = new Uint8Array(8);

  reader.setRaw(true);
  writer.writeSync(encoder.encode(cursorPosition));
  reader.readSync(data);
  reader.setRaw(false);

  const [y, x] = decoder
    .decode(data)
    .match(/\[(\d+);(\d+)R/)
    ?.slice(1, 3)
    .map(Number) ?? [0, 0];

  return { x, y };
}
