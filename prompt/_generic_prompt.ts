import { AnsiEscape } from "../ansi_escape/ansi_escape.ts";
import { KeyCode } from "../keycode/key_code.ts";
import type { KeyEvent } from "../keycode/key_event.ts";
import { blue, bold, dim, green, red, yellow } from "./deps.ts";
import { Figures } from "./figures.ts";

/** Prompt validation return tape. */
export type ValidateResult = string | boolean | Promise<string | boolean>;

/** Generic prompt options. */
export interface GenericPromptOptions<T, V> {
  message: string;
  default?: T;
  validate?: (value: V) => ValidateResult;
  transform?: (value: V) => T | undefined;
  hint?: string;
  pointer?: string;
}

/** Generic prompt settings. */
export interface GenericPromptSettings<T, V>
  extends GenericPromptOptions<T, V> {
  pointer: string;
}

/** Static generic prompt interface. */
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

export interface Cursor {
  x: number;
  y: number;
}

export type RenderResult = [string, string | undefined, string | undefined];

/** Generic prompt representation. */
export abstract class GenericPrompt<
  T,
  V,
  S extends GenericPromptSettings<T, V>,
> {
  protected static injectedValue: unknown | undefined;
  protected readonly tty = AnsiEscape.from(Deno.stdout);
  protected readonly cursor: Cursor = {
    x: 0,
    y: 0,
  };
  #value: T | undefined;
  #lastError: string | undefined;
  #isFirstRun = true;

  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Input value.
   */
  public static inject(value: unknown): void {
    GenericPrompt.injectedValue = value;
  }

  protected constructor(protected readonly settings: S) {}

  /** Execute the prompt and show cursor on end. */
  public async prompt(): Promise<T> {
    try {
      return await this.#execute();
    } finally {
      this.tty.cursorShow();
    }
  }

  /** Clear prompt output. */
  protected clear(): void {
    this.tty
      .cursorLeft()
      .eraseDown();
  }

  /** Execute the prompt. */
  #execute = async (): Promise<T> => {
    // Throw errors on unit tests.
    if (typeof GenericPrompt.injectedValue !== "undefined" && this.#lastError) {
      throw new Error(await this.error());
    }

    await this.render();
    this.#lastError = undefined;

    if (!await this.read()) {
      return this.#execute();
    }

    if (typeof this.#value === "undefined") {
      throw new Error("internal error: failed to read value");
    }

    this.clear();
    const successMessage: string | undefined = this.success(
      this.#value,
    );
    if (successMessage) {
      await Deno.stdout.write(
        new TextEncoder().encode(successMessage + "\n"),
      );
    }

    GenericPrompt.injectedValue = undefined;
    this.tty.cursorShow();

    return this.#value;
  };

  /** Render prompt. */
  protected async render(): Promise<void> {
    const result: [string, string | undefined, string | undefined] =
      await Promise.all([
        this.message(),
        this.body?.(),
        this.footer(),
      ]);

    const content: string = result.filter(Boolean).join("\n");
    const y: number = content.split("\n").length - this.cursor.y - 1;

    if (!this.#isFirstRun || this.#lastError) {
      this.clear();
    }
    this.#isFirstRun = false;

    await Deno.stdout.write(new TextEncoder().encode(content));

    if (y) {
      this.tty.cursorUp(y);
    }
    this.tty.cursorTo(this.cursor.x);
  }

  /** Read user input from stdin, handle events and validate user input. */
  protected async read(): Promise<boolean> {
    if (typeof GenericPrompt.injectedValue !== "undefined") {
      const value: V = GenericPrompt.injectedValue as V;
      return this.#validateValue(value);
    }

    const events: KeyEvent[] = await this.#readKey();

    if (!events.length) {
      return false;
    }

    for (const event of events) {
      await this.handleEvent(event);
    }

    return typeof this.#value !== "undefined";
  }

  protected submit(): Promise<boolean> {
    return this.#validateValue(this.getValue());
  }

  protected message(): string {
    return ` ${yellow("?")} ` + bold(this.settings.message) + this.defaults();
  }

  protected defaults(): string {
    let defaultMessage = "";
    if (typeof this.settings.default !== "undefined") {
      defaultMessage += dim(` (${this.format(this.settings.default)})`);
    }
    return defaultMessage;
  }

  /** Get prompt success message. */
  protected success(value: T): string | undefined {
    return ` ${yellow("?")} ` + bold(this.settings.message) + this.defaults() +
      " " + this.settings.pointer +
      " " + green(this.format(value));
  }

  protected body?(): string | undefined | Promise<string | undefined>;

  protected footer(): string | undefined {
    return this.error() ?? this.hint();
  }

  protected error(): string | undefined {
    return this.#lastError
      ? red(bold(` ${Figures.CROSS} `) + this.#lastError)
      : undefined;
  }

  protected hint(): string | undefined {
    return this.settings.hint
      ? dim(blue(` ${Figures.POINTER} `) + this.settings.hint)
      : undefined;
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected abstract handleEvent(event: KeyEvent): void | Promise<void>;

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected abstract transform(value: V): T | undefined;

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected abstract validate(value: V): ValidateResult;

  /**
   * Format output value.
   * @param value Output value.
   */
  protected abstract format(value: T): string;

  /** Get input value. */
  protected abstract getValue(): V;

  /** Read user input from stdin and pars ansi codes. */
  #readKey = async (): Promise<KeyEvent[]> => {
    const data: Uint8Array = await this.#readChar();

    return data.length ? KeyCode.parse(data) : [];
  };

  /** Read user input from stdin. */
  #readChar = async (): Promise<Uint8Array> => {
    const buffer = new Uint8Array(8);

    Deno.setRaw(Deno.stdin.rid, true, { cbreak: true });
    const nread: number | null = await Deno.stdin.read(buffer);
    Deno.setRaw(Deno.stdin.rid, false);

    if (nread === null) {
      return buffer;
    }

    return buffer.subarray(0, nread);
  };

  /**
   * Map input value to output value. If a custom transform handler ist set, the
   * custom handler will be executed, otherwise the default transform handler
   * from the prompt will be executed.
   * @param value The value to transform.
   */
  #transformValue = (value: V): T | undefined => {
    return this.settings.transform
      ? this.settings.transform(value)
      : this.transform(value);
  };

  /**
   * Map input value to output value. If a default value is set, the default
   * will be used as value without any validation. If a custom validation
   * handler ist set, the custom handler will be executed, otherwise the default
   * validation handler from the prompt will be executed.
   * @param value
   */
  #validateValue = async (value: V): Promise<boolean> => {
    if (!value && typeof this.settings.default !== "undefined") {
      this.#value = this.settings.default;
      return true;
    }

    this.#value = undefined;
    this.#lastError = undefined;

    const validation =
      await (this.settings.validate
        ? this.settings.validate(value)
        : this.validate(value));

    if (validation === false) {
      this.#lastError = `Invalid answer.`;
    } else if (typeof validation === "string") {
      this.#lastError = validation;
    } else {
      this.#value = this.#transformValue(value);
    }

    return typeof this.#value !== "undefined";
  };

  /**
   * Check if key event has given name or sequence.
   * @param keys  Key map.
   * @param name  Key name.
   * @param event Key event.
   */
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
}
