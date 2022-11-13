import type { KeyCode } from "../keycode/mod.ts";
import { dim, green, red } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericList,
  GenericListKeys,
  GenericListOption,
  GenericListOptions,
} from "./_generic_list.ts";
import { GenericPrompt } from "./_generic_prompt.ts";

/** Checkbox prompt options. */
export interface CheckboxOptions
  extends GenericListOptions<string[], string[], CheckboxOption> {
  options: Array<string | CheckboxOption>;
  check?: string;
  uncheck?: string;
  minOptions?: number;
  maxOptions?: number;
  keys?: CheckboxKeys;
}

/** Checkbox option options. */
export interface CheckboxOption extends GenericListOption {
  checked?: boolean;
  icon?: boolean;
}

/** Checkbox key options. */
export interface CheckboxKeys extends GenericListKeys {
  check?: string[];
}

/** Checkbox prompt representation. */
export class Checkbox extends GenericList<
  string[],
  string[],
  CheckboxOptions,
  CheckboxOption
> {
  /** Execute the prompt and show cursor on end. */
  public static prompt(options: CheckboxOptions): Promise<string[]> {
    return new this(options).prompt();
  }

  /**
   * Create list separator.
   * @param label Separator label.
   */
  public static separator(label?: string): CheckboxOption {
    return {
      ...super.separator(label),
      icon: false,
    };
  }

  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Array of input values.
   */
  public static inject(value: string[]): void {
    GenericPrompt.inject(value);
  }

  constructor(options: CheckboxOptions) {
    super({
      check: green(Figures.TICK),
      uncheck: red(Figures.CROSS),
      ...options,
      keys: {
        check: ["space"],
        ...(options.keys ?? {}),
      },
    });
  }

  /**
   * Map string option values to options and set option defaults.
   * @param options Checkbox options.
   */
  protected mapOptions(
    options: CheckboxOptions,
  ): Array<CheckboxOption> {
    return options.options
      .map((option: string | CheckboxOption) =>
        typeof option === "string" ? { value: option } : option
      )
      .map((option: CheckboxOption) => ({
        ...option,
        checked: typeof option.checked === "undefined" && options.default &&
            options.default.indexOf(option.value) !== -1
          ? true
          : !!option.checked,
        icon: typeof option.icon === "undefined" ? true : option.icon,
      }));
  }

  /**
   * Render checkbox option.
   * @param option      Checkbox option settings.
   * @param isSelected  Set to true if option is selected.
   */
  protected getListItem(
    option: CheckboxOption,
    isSelected?: boolean,
  ): string {
    let line = this.settings.indent ?? "";

    // pointer
    line += isSelected && this.settings.listPointer
      ? this.settings.listPointer + " "
      : "  ";

    // icon
    if (option.icon) {
      let check = option.checked
        ? this.settings.check ? this.settings.check + " " : "  "
        : this.settings.uncheck
        ? this.settings.uncheck + " "
        : "  ";
      if (option.disabled) {
        check = dim(check);
      }
      line += check;
    } else {
      line += "  ";
    }

    // value
    line += `${
      isSelected && !option.disabled
        ? this.highlight(option.name || option.value, (val) => val)
        : this.highlight(option.name || option.value)
    }`;

    return line;
  }

  /** Get value of checked options. */
  protected getValue(): string[] {
    return this.originalOptions
      .filter((option) => option.checked)
      .map((option) => option.value);
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyCode): Promise<void> {
    switch (true) {
      case this.isKey(this.settings.keys, "check", event):
        this.checkValue();
        break;
      default:
        await super.handleEvent(event);
    }
  }

  /** Check selected option. */
  protected checkValue(): void {
    const option = this.options[this.listIndex];
    if (option.disabled) {
      this.setErrorMessage("This option is disabled and cannot be changed.");
    } else {
      option.checked = !option.checked;
    }
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
        this.originalOptions.findIndex((option: CheckboxOption) =>
            option.value === val
          ) !== -1
      );

    if (!isValidValue) {
      return false;
    }

    if (this.settings.minOptions && value.length < this.settings.minOptions) {
      return `The minimum number of options is ${this.settings.minOptions} but got ${value.length}.`;
    }
    if (this.settings.maxOptions && value.length > this.settings.maxOptions) {
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

/**
 * Checkbox options type.
 * @deprecated Use `Array<string | CheckboxOption>` instead.
 */
export type CheckboxValueOptions = Array<string | CheckboxOption>;

/**
 * Checkbox option settings type.
 * @deprecated Use `Array<CheckboxOption>` instead.
 */
export type CheckboxValueSettings = Array<CheckboxOption>;

/**
 * Select option settings.
 * @deprecated Use `CheckboxOption` instead.
 */
export type CheckboxOptionSettings = CheckboxOption;
