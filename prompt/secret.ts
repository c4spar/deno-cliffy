import { stripeColors } from "../table/utils.ts";
import { blue, green, underline } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericInput,
  GenericInputKeys,
  GenericInputPromptOptions,
  GenericInputPromptSettings,
} from "./_generic-input.ts";

export type SecretKeys = GenericInputKeys;

export interface SecretOptions extends GenericInputPromptOptions<string> {
  label?: string;
  hidden?: boolean;
  minLength?: number;
  maxLength?: number;
  keys?: SecretKeys;
}

interface SecretSettings extends GenericInputPromptSettings<string> {
  label: string;
  hidden: boolean;
  minLength: number;
  maxLength: number;
  keys?: SecretKeys;
}

export class Secret extends GenericInput<string, SecretSettings> {
  public static async prompt(options: string | SecretOptions): Promise<string> {
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

  protected setPrompt(message: string) {
    if (this.settings.hidden) {
      this.screen.cursorHide();
    }

    message += " " + this.settings.pointer + " ";

    const length = new TextEncoder().encode(stripeColors(message)).length;

    const secret = this.settings.hidden ? "" : "*".repeat(this.input.length);

    message += underline(secret);

    this.write(message);

    this.screen.cursorTo(length - 1 + this.index);
  }

  protected async getSuccessMessage(value: string) {
    value = this.settings.hidden ? "*".repeat(8) : "*".repeat(value.length);
    return `${await this.getMessage()} ${this.settings.pointer} ${
      green(value)
    }`;
  }

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

  protected transform(value: string): string | undefined {
    return value;
  }

  protected format(value: string): string {
    return value;
  }
}
