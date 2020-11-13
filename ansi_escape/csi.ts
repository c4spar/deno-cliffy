import { encodeBase64 } from "./deps.ts";

/** Escape sequence: `\x1B` */
export const ESC = "\x1B";
/** Control sequence intro: `\x1B[` */
export const CSI = `${ESC}[`;
/** Operating system command: `\x1B]` */
export const OSC = `${ESC}]`;
/** Ring audio bell: `\u0007` */
export const BEL = "\u0007";
const SEP = ";";

/**
 * Cursor handler.
 * ```
 * await Deno.stdout.write(
 *   new TextEncoder().encode(
 *     cursor.to(0, 0),
 *   ),
 * );
 * ```
 */
export const cursor = {
  /**
   * Move cursor to x, y, counting from the top left corner.
   * @param x Position left.
   * @param y Position top.
   */
  to(x: number, y?: number): string {
    if (typeof y !== "number") {
      return `${CSI}${x}G`;
    }
    return `${CSI}${y};${x}H`;
  },
  /**
   * Move cursor by offset.
   * @param x Offset left.
   * @param y Offset top.
   */
  move(x: number, y: number): string {
    let ret = "";

    if (x < 0) {
      ret += `${CSI}${-x}D`;
    } else if (x > 0) {
      ret += `${CSI}${x}C`;
    }

    if (y < 0) {
      ret += `${CSI}${-y}A`;
    } else if (y > 0) {
      ret += `${CSI}${y}B`;
    }

    return ret;
  },
  /**
   * Move cursor up by n lines.
   * @param count Number of lines.
   */
  up: (count = 1): string => `${CSI}${count}A`,
  /**
   * Move cursor down by n lines.
   * @param count Number of lines.
   */
  down: (count = 1): string => `${CSI}${count}B`,
  /**
   * Move cursor right by n lines.
   * @param count Number of lines.
   */
  forward: (count = 1): string => `${CSI}${count}C`,
  /**
   * Move cursor left by n lines.
   * @param count Number of lines.
   */
  backward: (count = 1): string => `${CSI}${count}D`,
  /**
   * Move cursor to the beginning of the line n lines down.
   * @param count Number of lines.
   */
  nextLine: (count = 1): string => `${CSI}E`.repeat(count),
  /**
   * Move cursor to the beginning of the line n lines up.
   * @param count Number of lines.
   */
  prevLine: (count = 1): string => `${CSI}F`.repeat(count),
  /** Move cursor to first column of current row. */
  left: `${CSI}G`,
  /** Hide cursor. */
  hide: `${CSI}?25l`,
  /** Show cursor. */
  show: `${CSI}?25h`,
  /** Save cursor. */
  save: `${ESC}7`,
  /** Restore cursor. */
  restore: `${ESC}8`,
};

/**
 * Scroll handler.
 * ```
 * await Deno.stdout.write(
 *   new TextEncoder().encode(
 *     scroll.up(10),
 *   ),
 * );
 * ```
 */
export const scroll = {
  /**
   * Scroll window up by n lines.
   * @param count Number of lines.
   */
  up: (count = 1): string => `${CSI}S`.repeat(count),
  /**
   * Scroll window down by n lines.
   * @param count Number of lines.
   */
  down: (count = 1): string => `${CSI}T`.repeat(count),
};

/**
 * Erase handler.
 * ```
 * await Deno.stdout.write(
 *   new TextEncoder().encode(
 *     erase.up(3),
 *   ),
 * );
 * ```
 */
export const erase = {
  /** Clear screen. */
  screen: `${CSI}2J`,
  /**
   * Clear screen up.
   * @param count Number of lines.
   */
  up: (count = 1): string => `${CSI}1J`.repeat(count),
  /**
   * Clear screen down.
   * @param count Number of lines.
   */
  down: (count = 1): string => `${CSI}0J`.repeat(count),
  /** Clear current line. */
  line: `${CSI}2K`,
  /** Clear to line end. */
  lineEnd: `${CSI}0K`,
  /** Clear to line start. */
  lineStart: `${CSI}1K`,
  /**
   * Clear n line's up.
   * @param count Number of lines.
   */
  lines(count: number): string {
    let clear = "";
    for (let i = 0; i < count; i++) {
      clear += this.line + (i < count - 1 ? cursor.up() : "");
    }
    clear += cursor.left;
    return clear;
  },
};

/**
 * Create link.
 * @param text Link text.
 * @param url Link url.
 * ```
 * console.log(
 *   link("Click me.", "https://deno.land"),
 * );
 * ```
 */
export const link = (text: string, url: string): string =>
  [
    OSC,
    "8",
    SEP,
    SEP,
    url,
    BEL,
    text,
    OSC,
    "8",
    SEP,
    SEP,
    BEL,
  ].join("");

/** Image options. */
export interface ImageOptions {
  width?: number;
  height?: number;
  preserveAspectRatio?: boolean;
}

/**
 * Create image.
 * @param buffer  Image buffer.
 * @param options Image options.
 * ```
 * const response = await fetch("https://deno.land/images/hashrock_simple.png");
 * const imageBuffer: ArrayBuffer = await response.arrayBuffer();
 * console.log(
 *   image(imageBuffer),
 * );
 * ```
 */
export const image = (
  buffer: string | ArrayBuffer,
  options?: ImageOptions,
): string => {
  let ret = `${OSC}1337;File=inline=1`;

  if (options?.width) {
    ret += `;width=${options.width}`;
  }

  if (options?.height) {
    ret += `;height=${options.height}`;
  }

  if (options?.preserveAspectRatio === false) {
    ret += ";preserveAspectRatio=0";
  }

  return ret + ":" + encodeBase64(buffer) + BEL;
};
