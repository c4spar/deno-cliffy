import { GenericPrompt } from "./_generic_prompt.ts";
import { underline } from "./deps.ts";
import {
  GenericInput,
  GenericInputKeys,
  GenericInputPromptOptions,
} from "./_generic_input.ts";

/** Secret prompt options. */
export interface SecretOptions
  extends GenericInputPromptOptions<string, string> {
  label?: string;
  hidden?: boolean;
  minLength?: number;
  maxLength?: number;
  keys?: SecretKeys;
}

/** Secret key options. */
export type SecretKeys = GenericInputKeys;

/** Secret prompt representation. */
export class Secret extends GenericInput<string, string, SecretOptions> {
  readonly #label: string;
  /** Execute the prompt and show cursor on end. */
  public static prompt(options: string | SecretOptions): Promise<string> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this(options).prompt();
  }

  constructor(options: SecretOptions) {
    super(options);
    this.#label = this.settings.label || "Secret";
  }

  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Input value.
   */
  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

  protected input(): string {
    return underline(
      this.settings.hidden ? "" : "*".repeat(this.inputValue.length),
    );
  }

  /** Read user input. */
  protected read(): Promise<boolean> {
    if (this.settings.hidden) {
      this.tty.cursorHide();
    }
    return super.read();
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    if (typeof value !== "string") {
      return false;
    }
    if (this.settings.minLength && value.length < this.settings.minLength) {
      return `${this.#label} must be longer then ${this.settings.minLength} but has a length of ${value.length}.`;
    }
    if (this.settings.maxLength && value.length > this.settings.maxLength) {
      return `${this.#label} can't be longer then ${this.settings.maxLength} but has a length of ${value.length}.`;
    }
    return true;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): string | undefined {
    return value;
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: string): string {
    return this.settings.hidden ? "*".repeat(8) : "*".repeat(value.length);
  }

  /** Get input value. */
  protected getValue(): string {
    return this.inputValue;
  }
}
