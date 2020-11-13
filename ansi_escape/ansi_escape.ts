import {
  BEL,
  cursor,
  erase,
  image,
  ImageOptions,
  link,
  scroll,
} from "./csi.ts";

/** AnsiEscape representation. */
export class AnsiEscape {
  /** Create instance from file. */
  public static from(file: Deno.WriterSync): AnsiEscape {
    return new this(file);
  }

  protected constructor(protected file: Deno.WriterSync) {}

  /**
   * Write to file.
   * @param code Value.
   */
  protected write(code: string): this {
    this.file.writeSync(new TextEncoder().encode(code));
    return this;
  }

  /** Ring audio bell. */
  public beep(): this {
    return this.write(BEL);
  }

  /**
   * Cursor
   */

  /**
   * Move cursor to x, y, counting from the top left corner.
   * @param x Position left.
   * @param y Position top.
   */
  public cursorTo(x: number, y?: number): this {
    return this.write(cursor.to(x, y));
  }

  /**
   * Move cursor by offset.
   * @param x Offset left.
   * @param y Offset top.
   */
  public cursorMove(x: number, y: number): this {
    return this.write(cursor.move(x, y));
  }

  /**
   * Move cursor up by n lines.
   * @param count Number of lines.
   */
  public cursorUp(count = 1): this {
    return this.write(cursor.up(count));
  }

  /**
   * Move cursor down by n lines.
   * @param count Number of lines.
   */
  public cursorDown(count = 1): this {
    return this.write(cursor.down(count));
  }

  /**
   * Move cursor forward by n lines.
   * @param count Number of lines.
   */
  public cursorForward(count = 1): this {
    return this.write(cursor.forward(count));
  }

  /**
   * Move cursor backward by n lines.
   * @param count Number of lines.
   */
  public cursorBackward(count = 1): this {
    return this.write(cursor.backward(count));
  }

  /**
   * Move cursor to the beginning of the line n lines down.
   * @param count Number of lines.
   */
  public cursorNextLine(count = 1): this {
    return this.write(cursor.nextLine(count));
  }

  /**
   * Move cursor to the beginning of the line n lines up.
   * @param count Number of lines.
   */
  public cursorPrevLine(count = 1): this {
    return this.write(cursor.prevLine(count));
  }

  /** Move cursor to first column of current row. */
  public cursorLeft(): this {
    return this.write(cursor.left);
  }

  /** Hide cursor. */
  public cursorHide(): this {
    return this.write(cursor.hide);
  }

  /** Show cursor. */
  public cursorShow(): this {
    return this.write(cursor.show);
  }

  /** Save cursor. */
  public cursorSave(): this {
    return this.write(cursor.save);
  }

  /** Restore cursor. */
  public cursorRestore(): this {
    return this.write(cursor.restore);
  }

  /**
   * Scroll
   */

  /**
   * Scroll window up by n lines.
   * @param count Number of lines.
   */
  public scrollUp(count = 1): this {
    return this.write(scroll.up(count));
  }

  /**
   * Scroll window down by n lines.
   * @param count Number of lines.
   */
  public scrollDown(count = 1): this {
    return this.write(scroll.down(count));
  }

  /**
   * Erase
   */

  /** Clear screen. */
  public eraseScreen(): this {
    return this.write(erase.screen);
  }

  /**
   * Clear screen up.
   * @param count Number of lines.
   */
  public eraseUp(count = 1): this {
    return this.write(erase.up(count));
  }

  /**
   * Clear screen down.
   * @param count Number of lines.
   */
  public eraseDown(count = 1): this {
    return this.write(erase.down(count));
  }

  /** Clear current line. */
  public eraseLine(): this {
    return this.write(erase.line);
  }

  /** Clear to line end. */
  public eraseLineEnd(): this {
    return this.write(erase.lineEnd);
  }

  /** Clear to line start. */
  public eraseLineStart(): this {
    return this.write(erase.lineStart);
  }

  /**
   * Clear n line's up.
   * @param count Number of lines.
   */
  public eraseLines(count: number): this {
    return this.write(erase.lines(count));
  }

  /**
   * Style
   */

  /**
   * Render link.
   * @param text Link text.
   * @param url Link url.
   */
  public link(text: string, url: string): this {
    return this.write(link(text, url));
  }

  /**
   * Render image.
   * @param buffer  Image buffer.
   * @param options Image options.
   */
  public image(buffer: Uint8Array, options?: ImageOptions): this {
    return this.write(image(buffer, options));
  }
}
