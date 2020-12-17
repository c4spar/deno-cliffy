import {
  GenericInput,
  GenericInputPromptOptions,
  GenericInputPromptSettings,
} from "./_generic_input.ts";
import { bold, dim, red, stripColor, yellow } from "./deps.ts";
import { Figures } from "./figures.ts";
import { InputKeys } from "./input.ts";
import { SelectOption } from "./select.ts";

type UnsupportedInputKeys =
  | "complete"
  | "selectNextHistory"
  | "selectPreviousHistory";

/** Select key options. */
export interface GenericListKeys
  extends Omit<InputKeys, UnsupportedInputKeys> {}

/** Generic list option options. */
export interface GenericListOption {
  value: string;
  name?: string;
  disabled?: boolean;
}

/** Generic list option settings. */
export interface GenericListOptionSettings extends GenericListOption {
  name: string;
  value: string;
  disabled: boolean;
}

export type GenericListValueOptions = (string | GenericListOption)[];
export type GenericListValueSettings = GenericListOptionSettings[];

/** Generic list prompt options. */
export interface GenericListOptions<T, V>
  extends GenericInputPromptOptions<T, V> {
  options: GenericListValueOptions;
  indent?: string;
  listPointer?: string;
  maxRows?: number;
  filter?: boolean | string;
}

/** Generic list prompt settings. */
export interface GenericListSettings<T, V>
  extends GenericInputPromptSettings<T, V> {
  options: GenericListValueSettings;
  indent: string;
  listPointer: string;
  maxRows: number;
  filter?: boolean | string;
}

/** Generic list prompt representation. */
export abstract class GenericList<T, V, S extends GenericListSettings<T, V>>
  extends GenericInput<T, V, S> {
  protected listOffset = 0;
  protected listIndex = 0;
  protected options: S["options"] = this.settings.options;

  /**
   * Create list separator.
   * @param label Separator label.
   */
  public static separator(label = "------------"): GenericListOption {
    return { value: label, disabled: true };
  }

  /**
   * Set list option defaults.
   * @param option List option.
   */
  protected static mapOption(
    option: GenericListOption,
  ): GenericListOptionSettings {
    return {
      value: option.value,
      name: typeof option.name === "undefined" ? option.value : option.name,
      disabled: !!option.disabled,
    };
  }

  protected message(): string {
    let message = ` ${yellow("?")} ` + bold(this.settings.message) +
      this.defaults();
    if (this.settings.filter) {
      message += " " + this.settings.pointer + " ";
    }
    this.cursor.x = stripColor(message).length + this.inputIndex + 1;
    return message + this.input();
  }

  /** Render options. */
  protected body(): string | undefined | Promise<string | undefined> {
    const body: Array<string> = [];
    const height: number = this.getListHeight();
    for (let i = this.listOffset; i < this.listOffset + height; i++) {
      body.push(
        this.getListItem(
          this.options[i],
          this.listIndex === i,
        ),
      );
    }
    if (!body.length) {
      body.push(
        this.settings.indent + yellow("  No matches..."),
      );
    }
    return body.join("\n");
  }

  /**
   * Render option.
   * @param item        Option.
   * @param isSelected  Set to true if option is selected.
   */
  protected abstract getListItem(
    item: GenericListOptionSettings,
    isSelected?: boolean,
  ): string;

  protected match(needle: string = this.inputValue): void {
    this.options = this.settings.options.filter(
      (option: SelectOption) =>
        (option.name ?? option.value).toString().toLowerCase().startsWith(
          needle.toLowerCase(),
        ),
    );
    this.listIndex = Math.max(
      0,
      Math.min(this.options.length - 1, this.listIndex),
    );
    this.listOffset = Math.max(
      0,
      Math.min(
        this.options.length - this.getListHeight(),
        this.listOffset,
      ),
    );
  }

  /** Read user input. */
  protected read(): Promise<boolean> {
    if (!this.settings.filter) {
      this.tty.cursorHide();
    }
    return super.read();
  }

  /** Select previous option. */
  protected selectPrevious(): void {
    if (this.options.length < 2) {
      return;
    }
    if (this.listIndex > 0) {
      this.listIndex--;
      if (this.listIndex < this.listOffset) {
        this.listOffset--;
      }
      if (this.options[this.listIndex].disabled) {
        this.selectPrevious();
      }
    } else {
      this.listIndex = this.options.length - 1;
      this.listOffset = this.options.length - this.getListHeight();
      if (this.options[this.listIndex].disabled) {
        this.selectPrevious();
      }
    }
  }

  /** Select next option. */
  protected selectNext(): void {
    if (this.options.length < 2) {
      return;
    }
    if (this.listIndex < this.options.length - 1) {
      this.listIndex++;
      if (this.listIndex >= this.listOffset + this.getListHeight()) {
        this.listOffset++;
      }
      if (this.options[this.listIndex].disabled) {
        this.selectNext();
      }
    } else {
      this.listIndex = this.listOffset = 0;
      if (this.options[this.listIndex].disabled) {
        this.selectNext();
      }
    }
  }

  /** Get options row height. */
  protected getListHeight(): number {
    return Math.min(
      this.options.length,
      this.settings.maxRows || this.options.length,
    );
  }

  /**
   * Find option by value.
   * @param value Value of the option.
   */
  protected getOptionByValue(
    value: string,
  ): GenericListOptionSettings | undefined {
    return this.options.find((option) => option.value === value);
  }
}
