import { AnsiEscape } from "../ansi-escape/ansi-escape.ts";
import { KeyCode } from "../keycode/key-code.ts";
import type { KeyEvent } from "../keycode/key-event.ts";
import { blue, bold, dim, green, red, yellow } from "./deps.ts";
import { Figures } from "./figures.ts";

export type ValidateResult = string | boolean | Promise<string | boolean>;

export interface GenericPromptOptions<T, V> {
  message: string;
  default?: T;
  validate?: (value: V) => ValidateResult;
  transform?: (value: V) => T | undefined;
  hint?: string;
  pointer?: string;
}

export interface GenericPromptSettings<T, V>
  extends GenericPromptOptions<T, V> {
  pointer: string;
}

export interface StaticGenericPrompt<
  T,
  V,
  O extends GenericPromptOptions<T, V>,
  S extends GenericPromptSettings<T, V>,
  P extends GenericPrompt<T, V, S>,
> {
  inject?(value: T): void;

  prompt(options: O): Promise<T>;
}

export abstract class GenericPrompt<
  T,
  V,
  S extends GenericPromptSettings<T, V>,
> {
  // deno-lint-ignore no-explicit-any
  protected static injectedValue: any | undefined;

  protected screen = AnsiEscape.from(Deno.stdout);
  protected lastError: string | undefined;
  protected isRunning = false;
  protected value: T | undefined;

  // deno-lint-ignore no-explicit-any
  public static inject(value: any): void {
    GenericPrompt.injectedValue = value;
  }

  protected constructor(protected readonly settings: S) {}

  public async prompt(): Promise<T> {
    try {
      return await this.execute();
    } finally {
      this.screen.cursorShow();
    }
  }

  protected abstract setPrompt(message: string): void | Promise<void>;

  protected abstract async handleEvent(event: KeyEvent): Promise<boolean>;

  protected abstract transform(value: V): T | undefined;

  protected abstract validate(value: V): ValidateResult;

  protected abstract format(value: T): string;

  protected abstract getValue(): V;

  protected clear() {
    this.screen
      .cursorLeft()
      .eraseDown();
  }

  protected async execute(): Promise<T> {
    if (this.lastError || this.isRunning) {
      this.clear();
    }

    this.isRunning = true;

    // be sure there are empty lines after the cursor to fix restoring the cursor if terminal output is bigger than terminal window.
    const message: string = await this.getMessage();
    this.preBufferEmptyLines(this.lastError || this.settings.hint || "");

    await this.setPrompt(message);

    if (this.lastError || this.settings.hint) {
      this.screen.cursorSave();
      this.writeLine();
      if (this.lastError) {
        this.error(this.lastError);
        this.lastError = undefined;
      } else if (this.settings.hint) {
        this.hint(this.settings.hint);
      }
      this.screen.cursorRestore();
    }

    if (!await this.read()) {
      return this.execute();
    }

    if (typeof this.value === "undefined") {
      throw new Error("internal error: failed to read value");
    }

    this.clear();
    this.writeLine(await this.getSuccessMessage(this.value));

    this.screen.cursorShow();

    GenericPrompt.injectedValue = undefined;
    this.isRunning = false;

    return this.value;
  }

  protected getMessage(): string | Promise<string> {
    let message = ` ${yellow("?")} ${bold(this.settings.message)}`;

    if (typeof this.settings.default !== "undefined") {
      message += dim(` (${this.format(this.settings.default)})`);
    }

    return message;
  }

  protected async getSuccessMessage(value: T) {
    return `${await this.getMessage()} ${this.settings.pointer} ${
      green(this.format(value))
    }`;
  }

  protected async read(): Promise<boolean> {
    if (typeof GenericPrompt.injectedValue !== "undefined") {
      const value: V = GenericPrompt.injectedValue;
      return this.validateValue(value);
    }

    const events: KeyEvent[] = await this.readKey();

    if (!events.length) {
      return false;
    }

    let done = false;

    for (const event of events) {
      done = await this.handleEvent(event);
    }

    if (done) {
      return this.validateValue(this.getValue());
    }

    return false;
  }

  protected async readKey(): Promise<KeyEvent[]> {
    const data: Uint8Array = await this.readChar();

    return data.length ? KeyCode.parse(data) : [];
  }

  protected async readChar(): Promise<Uint8Array> {
    const buffer = new Uint8Array(8);

    Deno.setRaw(Deno.stdin.rid, true);
    const nread: number | null = await Deno.stdin.read(buffer);
    Deno.setRaw(Deno.stdin.rid, false);

    if (nread === null) {
      return buffer;
    }

    return buffer.subarray(0, nread);
  }

  protected transformValue(value: V): T | undefined {
    return this.settings.transform
      ? this.settings.transform(value)
      : this.transform(value);
  }

  protected async validateValue(value: V): Promise<boolean> {
    if (!value && typeof this.settings.default !== "undefined") {
      this.value = this.settings.default;
      return true;
    }

    const validation =
      await (this.settings.validate
        ? this.settings.validate(value)
        : this.validate(value));

    if (validation === false) {
      this.lastError = `Invalid answer.`;
    } else if (typeof validation === "string") {
      this.lastError = validation;
    } else {
      this.value = this.transformValue(value);
    }

    return !this.lastError;
  }

  // deno-lint-ignore no-explicit-any
  protected isKey<K extends any, N extends keyof K>(
    keys: K | undefined,
    name: N,
    event: KeyEvent,
  ): boolean {
    // deno-lint-ignore no-explicit-any
    const keyNames: Array<unknown> | undefined = keys?.[name] as any;
    return typeof keyNames !== "undefined" && (
      (typeof event.name !== "undefined" &&
        keyNames.indexOf(event.name) !== -1) ||
      (typeof event.sequence !== "undefined" &&
        keyNames.indexOf(event.sequence) !== -1)
    );
  }

  protected write(value: string) {
    Deno.stdout.writeSync(new TextEncoder().encode(value));
  }

  protected writeLine(value?: string) {
    Deno.stdout.writeSync(new TextEncoder().encode((value ?? "") + "\n"));
  }

  protected preBufferEmptyLines(message: string) {
    const linesCount: number = message.split("\n").length;
    this.write("\n".repeat(linesCount));
    this.screen.cursorUp(linesCount);
  }

  protected error(message: string) {
    if (typeof GenericPrompt.injectedValue !== "undefined") {
      throw new Error(red(bold(` ${Figures.CROSS} `) + message));
    }
    this.write(red(bold(` ${Figures.CROSS} `) + message));
  }

  protected message(message: string) {
    this.write(blue(` ${Figures.POINTER} `) + message);
  }

  protected hint(hint: string) {
    this.write(dim(blue(` ${Figures.POINTER} `) + hint));
  }
}
