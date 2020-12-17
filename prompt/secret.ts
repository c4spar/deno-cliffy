import {
  blue,
  bold,
  dim,
  green,
  stripColor,
  underline,
  yellow,
} from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericInput,
  GenericInputKeys,
  GenericInputPromptOptions,
  GenericInputPromptSettings,
} from "./_generic_input.ts";

/** Secret key options. */
export type SecretKeys = GenericInputKeys;

/** Secret prompt options. */
export interface SecretOptions
  extends Omit<GenericInputPromptOptions<string>, "suggestions"> {
  label?: string;
  hidden?: boolean;
  minLength?: number;
  maxLength?: number;
  keys?: SecretKeys;
}

/** Secret prompt settings. */
interface SecretSettings
  extends Omit<GenericInputPromptSettings<string>, "suggestions"> {
  label: string;
  hidden: boolean;
  minLength: number;
  maxLength: number;
  keys?: SecretKeys;
}

/** Secret prompt representation. */
export class Secret extends GenericInput<string, SecretSettings> {
  /** Execute the prompt and show cursor on end. */
  public static prompt(options: string | SecretOptions): Promise<string> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      label: "Password",
      hidden: false,
      minLength: 0,
      maxLength: Infinity,
      ...options,
    }).prompt();
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
    if (value.length < this.settings.minLength) {
      return `${this.settings.label} must be longer then ${this.settings.minLength} but has a length of ${value.length}.`;
    }
    if (value.length > this.settings.maxLength) {
      return `${this.settings.label} can't be longer then ${this.settings.maxLength} but has a length of ${value.length}.`;
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
}
