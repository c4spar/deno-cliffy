import { blue, dim, stripColor, underline } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericInput,
  GenericInputKeys,
  GenericInputPromptOptions,
  GenericInputPromptSettings,
} from "./_generic_input.ts";

/** List key options. */
export type ListKeys = GenericInputKeys;

/** List prompt options. */
export interface ListOptions extends GenericInputPromptOptions<string[]> {
  separator?: string;
  minLength?: number;
  maxLength?: number;
  minTags?: number;
  maxTags?: number;
  keys?: ListKeys;
}

/** List prompt settings. */
interface ListSettings extends GenericInputPromptSettings<string[]> {
  separator: string;
  minLength: number;
  maxLength: number;
  minTags: number;
  maxTags: number;
  keys?: ListKeys;
}

/** List prompt representation. */
export class List extends GenericInput<string[], ListSettings> {
  /** Execute the prompt and show cursor on end. */
  public static prompt(options: string | ListOptions): Promise<string[]> {
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

  protected input(): string {
    const oldInput: string = this.inputValue;
    const oldInputParts: string[] = oldInput.trimLeft().split(this.regexp());
    const separator: string = this.settings.separator + " ";

    this.inputValue = oldInputParts.join(separator);

    const diff = oldInput.length - this.inputValue.length;
    this.inputIndex -= diff;
    this.cursor.x -= diff;

    return oldInputParts
      .map((val: string) => underline(val))
      .join(separator) +
      dim(this.getSuggestion());
  }

  /** Create list regex.*/
  protected regexp(): RegExp {
    return new RegExp(
      this.settings.separator === " " ? ` +` : ` *${this.settings.separator} *`,
    );
  }

  protected getSuggestion(
    needle: string = this.inputValue.split(this.regexp()).pop() as string,
  ): string {
    return super.getSuggestion(needle);
  }

  protected match(
    needle: string = this.inputValue.split(this.regexp()).pop() as string,
  ): void {
    super.match(needle);
  }

  /** Add char. */
  protected addChar(char: string): void {
    switch (char) {
      case this.settings.separator:
        if (
          this.inputValue.length &&
          this.inputValue.trim().slice(-1) !== this.settings.separator
        ) {
          super.addChar(char);
        }
        break;
      default:
        super.addChar(char);
    }
  }

  /** Delete char left. */
  protected deleteChar(): void {
    if (this.inputValue[this.inputIndex - 1] === " ") {
      super.deleteChar();
    }
    super.deleteChar();
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

  /** Get input value. */
  protected getValue(): string {
    // Remove trailing comma and spaces.
    return super.getValue().replace(/,+\s*$/, "");
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): string[] {
    return value.trim().split(this.regexp());
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: string[]): string {
    return value.join(`, `);
  }
}
