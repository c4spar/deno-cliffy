import { blue } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericInput,
  GenericInputKeys,
  GenericInputPromptOptions,
  GenericInputPromptSettings,
} from "./_generic_input.ts";

export type InputKeys = GenericInputKeys;

/** Input prompt options. */
export interface InputOptions extends GenericInputPromptOptions<string> {
  minLength?: number;
  maxLength?: number;
  keys?: InputKeys;
}

/** Input prompt settings. */
interface InputSettings extends GenericInputPromptSettings<string> {
  minLength: number;
  maxLength: number;
  keys?: InputKeys;
}

/** Input prompt representation. */
export class Input extends GenericInput<string, InputSettings> {
  /** Execute the prompt and show cursor on end. */
  public static async prompt(options: string | InputOptions): Promise<string> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      minLength: 0,
      maxLength: Infinity,
      ...options,
    }).prompt();
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
      return `Value must be longer then ${this.settings.minLength} but has a length of ${value.length}.`;
    }
    if (value.length > this.settings.maxLength) {
      return `Value can't be longer then ${this.settings.maxLength} but has a length of ${value.length}.`;
    }
    return true;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): string | undefined {
    return value.trim();
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: string): string {
    return value;
  }
}
