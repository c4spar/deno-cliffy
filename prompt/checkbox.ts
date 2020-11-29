import type { KeyEvent } from "../keycode/mod.ts";
import { blue, dim, green, red } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericList,
  GenericListOption,
  GenericListOptions,
  GenericListOptionSettings,
  GenericListSettings,
} from "./_generic_list.ts";
import { GenericPrompt } from "./_generic_prompt.ts";

/** Checkbox key options. */
export interface CheckboxKeys {
  previous?: string[];
  next?: string[];
  submit?: string[];
  check?: string[];
}

/** Checkbox key settings. */
type CheckboxKeysSettings = Required<CheckboxKeys>;

/** Checkbox option options. */
export interface CheckboxOption extends GenericListOption {
  checked?: boolean;
  icon?: boolean;
}

/** Checkbox option settings. */
export interface CheckboxOptionSettings extends GenericListOptionSettings {
  checked: boolean;
  icon: boolean;
}

/** Checkbox options type. */
export type CheckboxValueOptions = (string | CheckboxOption)[];
/** Checkbox option settings type. */
export type CheckboxValueSettings = CheckboxOptionSettings[];

/** Checkbox prompt options. */
export interface CheckboxOptions
  extends GenericListOptions<string[], string[]> {
  options: CheckboxValueOptions;
  check?: string;
  uncheck?: string;
  minOptions?: number;
  maxOptions?: number;
  keys?: CheckboxKeys;
}

/** Checkbox prompt settings. */
interface CheckboxSettings extends GenericListSettings<string[], string[]> {
  options: CheckboxValueSettings;
  check: string;
  uncheck: string;
  minOptions: number;
  maxOptions: number;
  keys: CheckboxKeysSettings;
}

/** Checkbox prompt representation. */
export class Checkbox
  extends GenericList<string[], string[], CheckboxSettings> {
  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Array of input values.
   */
  public static inject(value: string[]): void {
    GenericPrompt.inject(value);
  }

  /** Execute the prompt and show cursor on end. */
  public static prompt(options: CheckboxOptions): Promise<string[]> {
    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      listPointer: blue(Figures.POINTER),
      indent: " ",
      maxRows: 10,
      minOptions: 0,
      maxOptions: Infinity,
      check: green(Figures.TICK),
      uncheck: red(Figures.CROSS),
      ...options,
      keys: {
        previous: ["up", "u"],
        next: ["down", "d"],
        submit: ["return", "enter"],
        check: ["space"],
        ...(options.keys ?? {}),
      },
      options: Checkbox.mapOptions(options),
    }).prompt();
  }

  /**
   * Create list separator.
   * @param label Separator label.
   */
  public static separator(label = "------------"): CheckboxOption {
    return {
      ...super.separator(),
      icon: false,
    };
  }

  /**
   * Map string option values to options and set option defaults.
   * @param options Checkbox options.
   */
  protected static mapOptions(options: CheckboxOptions): CheckboxValueSettings {
    return options.options
      .map((item: string | CheckboxOption) =>
        typeof item === "string" ? { value: item } : item
      )
      .map((item) => ({
        ...this.mapItem(item),
        checked: typeof item.checked === "undefined" && options.default &&
            options.default.indexOf(item.value) !== -1
          ? true
          : !!item.checked,
        icon: typeof item.icon === "undefined" ? true : item.icon,
      }));
  }

  /**
   * Render checkbox option.
   * @param item        Checkbox option settings.
   * @param isSelected  Set to true if option is selected.
   */
  protected getListItem(
    item: CheckboxOptionSettings,
    isSelected?: boolean,
  ): string {
    let line = this.settings.indent;

    // pointer
    line += isSelected ? this.settings.listPointer + " " : "  ";

    // icon
    if (item.icon) {
      let check = item.checked
        ? this.settings.check + " "
        : this.settings.uncheck + " ";
      if (item.disabled) {
        check = dim(check);
      }
      line += check;
    } else {
      line += "  ";
    }

    // value
    line += `${isSelected ? item.name : dim(item.name)}`;

    return line;
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected handleEvent(event: KeyEvent): boolean {
    switch (true) {
      case event.name === "c":
        // @TODO: implement Deno.Signal?: https://deno.land/std/manual.md#handle-os-signals
        if (event.ctrl) {
          this.screen.cursorShow();
          return Deno.exit(0);
        }
        break;

      case this.isKey(this.settings.keys, "previous", event):
        this.selectPrevious();
        break;

      case this.isKey(this.settings.keys, "next", event):
        this.selectNext();
        break;

      case this.isKey(this.settings.keys, "check", event):
        this.checkValue();
        break;

      case this.isKey(this.settings.keys, "submit", event):
        return true;
    }

    return false;
  }

  /** Check selected option. */
  protected checkValue(): void {
    const item = this.settings.options[this.selected];
    item.checked = !item.checked;
  }

  /** Get value of checked options. */
  protected getValue(): string[] {
    return this.settings.options
      .filter((item) => item.checked)
      .map((item) => item.value);
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string[]): boolean | string {
    const isValidValue = Array.isArray(value) &&
      value.every((val) =>
        typeof val === "string" &&
        val.length > 0 &&
        this.settings.options.findIndex((option: CheckboxOptionSettings) =>
            option.value === val
          ) !== -1
      );

    if (!isValidValue) {
      return false;
    }

    if (value.length < this.settings.minOptions) {
      return `The minimum number of options is ${this.settings.minOptions} but got ${value.length}.`;
    }
    if (value.length > this.settings.maxOptions) {
      return `The maximum number of options is ${this.settings.maxOptions} but got ${value.length}.`;
    }

    return true;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string[]): string[] {
    return value.map((val) => val.trim());
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: string[]): string {
    return value.map((val) => this.getOptionByValue(val)?.name ?? val)
      .join(", ");
  }
}
