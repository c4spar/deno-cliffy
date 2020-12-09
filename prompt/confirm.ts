import { blue, bold, dim, yellow } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericInput,
  GenericInputKeys,
  GenericInputPromptOptions,
  GenericInputPromptSettings,
} from "./_generic_input.ts";

export type ConfirmKeys = GenericInputKeys;

/** Confirm prompt options. */
export interface ConfirmOptions extends GenericInputPromptOptions<boolean> {
  active?: string;
  inactive?: string;
  keys?: ConfirmKeys;
}

/** Confirm prompt settings. */
interface ConfirmSettings extends GenericInputPromptSettings<boolean> {
  active: string;
  inactive: string;
  keys?: ConfirmKeys;
}

/** Confirm prompt representation. */
export class Confirm extends GenericInput<boolean, ConfirmSettings> {
  /** Execute the prompt and show cursor on end. */
  public static prompt(
    options: string | ConfirmOptions,
  ): Promise<boolean> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this({
      active: "Yes",
      inactive: "No",
      pointer: blue(Figures.POINTER_SMALL),
      ...options,
    }).prompt();
  }

  protected defaults(): string {
    let defaultMessage = "";

    if (this.settings.default === true) {
      defaultMessage += this.settings.active[0].toUpperCase() + "/" +
        this.settings.inactive[0].toLowerCase();
    } else if (this.settings.default === false) {
      defaultMessage += this.settings.active[0].toLowerCase() + "/" +
        this.settings.inactive[0].toUpperCase();
    } else {
      defaultMessage += this.settings.active[0].toLowerCase() + "/" +
        this.settings.inactive[0].toLowerCase();
    }

    return defaultMessage ? dim(` (${defaultMessage})`) : "";
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    return typeof value === "string" &&
      [
          this.settings.active[0].toLowerCase(),
          this.settings.active.toLowerCase(),
          this.settings.inactive[0].toLowerCase(),
          this.settings.inactive.toLowerCase(),
        ].indexOf(value.toLowerCase()) !== -1;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): boolean | undefined {
    switch (value.toLowerCase()) {
      case this.settings.active[0].toLowerCase():
      case this.settings.active.toLowerCase():
        return true;
      case this.settings.inactive[0].toLowerCase():
      case this.settings.inactive.toLowerCase():
        return false;
    }
    return;
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: boolean): string {
    return value ? this.settings.active : this.settings.inactive;
  }
}
