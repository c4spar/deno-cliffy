import { stripeColors } from "../table/utils.ts";
import { blue, underline } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericInput,
  GenericInputKeys,
  GenericInputPromptOptions,
  GenericInputPromptSettings,
} from "./_generic-input.ts";

export type ListKeys = GenericInputKeys;

export interface ListOptions extends GenericInputPromptOptions<string[]> {
  separator?: string;
  minLength?: number;
  maxLength?: number;
  minTags?: number;
  maxTags?: number;
  keys?: ListKeys;
}

interface ListSettings extends GenericInputPromptSettings<string[]> {
  separator: string;
  minLength: number;
  maxLength: number;
  minTags: number;
  maxTags: number;
  keys?: ListKeys;
}

export class List extends GenericInput<string[], ListSettings> {
  public static async prompt(options: string | ListOptions): Promise<string[]> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      separator: ",",
      minLength: 0,
      maxLength: Infinity,
      minTags: 0,
      maxTags: Infinity,
      ...options,
    }).prompt();
  }

  protected setPrompt(message: string) {
    message += " " + this.settings.pointer + " ";

    const length = new TextEncoder().encode(stripeColors(message)).length;

    const oldInput: string = this.input;
    const oldInputParts: string[] = oldInput.trimLeft().split(this.regexp());

    this.input = oldInputParts.join(`${this.settings.separator} `);

    message += oldInputParts.map((val: string) => underline(val)).join(
      `${this.settings.separator} `,
    );

    const inputDiff = oldInput.length - this.input.length;

    this.index -= inputDiff;

    this.write(message);

    this.screen.cursorTo(length - 1 + this.index);
  }

  protected regexp() {
    return new RegExp(
      this.settings.separator === " " ? ` +` : ` *${this.settings.separator} *`,
    );
  }

  protected addChar(char: string): void {
    switch (char) {
      case this.settings.separator:
        if (
          this.input.length &&
          this.input.trim().slice(-1) !== this.settings.separator
        ) {
          super.addChar(char);
        }
        break;
      default:
        super.addChar(char);
    }
  }

  protected deleteChar(): void {
    if (this.input[this.index - 1] === " ") {
      super.deleteChar();
    }
    super.deleteChar();
  }

  protected validate(value: string): boolean | string {
    if (typeof value !== "string") {
      return false;
    }

    const values = this.transform(value).filter((val) => val !== "");

    for (const val of values) {
      if (val.length < this.settings.minLength) {
        return `Value must be longer then ${this.settings.minLength} but has a length of ${val.length}.`;
      }
      if (val.length > this.settings.maxLength) {
        return `Value can't be longer then ${this.settings.maxLength} but has a length of ${val.length}.`;
      }
    }

    if (values.length < this.settings.minTags) {
      return `The minimum number of tags is ${this.settings.minTags} but got ${values.length}.`;
    }
    if (values.length > this.settings.maxTags) {
      return `The maximum number of tags is ${this.settings.maxTags} but got ${values.length}.`;
    }

    return true;
  }

  protected transform(value: string): string[] {
    return value.trim().split(this.regexp());
  }

  protected format(value: string[]): string {
    return value.join(`, `);
  }
}
