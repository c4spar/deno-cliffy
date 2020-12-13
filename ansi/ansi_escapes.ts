import { encodeBase64 } from "./deps.ts";

/** Image options. */
export interface ImageOptions {
  width?: number;
  height?: number;
  preserveAspectRatio?: boolean;
}

/** Escape sequence: `\x1B` */
const ESC = "\x1B";
/** Control sequence intro: `\x1B[` */
const CSI = `${ESC}[`;
/** Operating system command: `\x1B]` */
const OSC = `${ESC}]`;
/** Link separator */
const SEP = ";";

export const ansiEscapes = {
  /** Ring audio bell: `\u0007` */
  bel: "\u0007",
  /** Get cursor position. */
  cursorPosition: `${CSI}6n`,
  /**
   * Move cursor to x, y, counting from the top left corner.
   * @param x Position left.
   * @param y Position top.
   */
  cursorTo(x: number, y?: number): string {
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
  cursorMove(x: number, y: number): string {
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
  cursorUp: (count = 1): string => `${CSI}${count}A`,
  /**
   * Move cursor down by n lines.
   * @param count Number of lines.
   */
  cursorDown: (count = 1): string => `${CSI}${count}B`,
  /**
   * Move cursor forward by n lines.
   * @param count Number of lines.
   */
  cursorForward: (count = 1): string => `${CSI}${count}C`,
  /**
   * Move cursor backward by n lines.
   * @param count Number of lines.
   */
  cursorBackward: (count = 1): string => `${CSI}${count}D`,
  /**
   * Move cursor to the beginning of the line n lines down.
   * @param count Number of lines.
   */
  cursorNextLine: (count = 1): string => `${CSI}E`.repeat(count),
  /**
   * Move cursor to the beginning of the line n lines up.
   * @param count Number of lines.
   */
  cursorPrevLine: (count = 1): string => `${CSI}F`.repeat(count),
  /** Move cursor to first column of current row. */
  cursorLeft: `${CSI}G`,
  /** Hide cursor. */
  cursorHide: `${CSI}?25l`,
  /** Show cursor. */
  cursorShow: `${CSI}?25h`,
  /** Save cursor. */
  cursorSave: `${ESC}7`,
  /** Restore cursor. */
  cursorRestore: `${ESC}8`,
  /**
   * Scroll window up by n lines.
   * @param count Number of lines.
   */
  scrollUp: (count = 1): string => `${CSI}S`.repeat(count),
  /**
   * Scroll window down by n lines.
   * @param count Number of lines.
   */
  scrollDown: (count = 1): string => `${CSI}T`.repeat(count),
  /** Clear screen. */
  eraseScreen: `${CSI}2J`,
  /**
   * Clear screen up.
   * @param count Number of lines.
   */
  eraseUp: (count = 1): string => `${CSI}1J`.repeat(count),
  /**
   * Clear screen down.
   * @param count Number of lines.
   */
  eraseDown: (count = 1): string => `${CSI}0J`.repeat(count),
  /** Clear current line. */
  eraseLine: `${CSI}2K`,
  /** Clear to line end. */
  eraseLineEnd: `${CSI}0K`,
  /** Clear to line start. */
  eraseLineStart: `${CSI}1K`,
  /**
   * Clear screen and move cursor by n lines up and move cursor to first column.
   * @param count Number of lines.
   */
  eraseLines(count: number): string {
    let clear = "";
    for (let i = 0; i < count; i++) {
      clear += ansiEscapes.eraseLine +
        (i < count - 1 ? ansiEscapes.cursorUp() : "");
    }
    clear += ansiEscapes.cursorLeft;
    return clear;
  },
  /**
   * Create link.
   * @param text Link text.
   * @param url Link url.
   * ```
   * console.log(
   *   ansi.link("Click me.", "https://deno.land"),
   * );
   * ```
   */
  link: (text: string, url: string): string =>
    [
      OSC,
      "8",
      SEP,
      SEP,
      url,
      ansiEscapes.bel,
      text,
      OSC,
      "8",
      SEP,
      SEP,
      ansiEscapes.bel,
    ].join(""),
  /**
   * Create image.
   * @param buffer  Image buffer.
   * @param options Image options.
   * ```
   * const response = await fetch("https://deno.land/images/hashrock_simple.png");
   * const imageBuffer: ArrayBuffer = await response.arrayBuffer();
   * console.log(
   *   ansi.image(imageBuffer),
   * );
   * ```
   */
  image(
    buffer: string | ArrayBuffer,
    options?: ImageOptions,
  ): string {
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

    return ret + ":" + encodeBase64(buffer) + ansiEscapes.bel;
  },
};
