import type { KeyCode } from "../keycode/mod.ts";
import { dim, green, red } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericList,
  GenericListKeys,
  GenericListOption,
  GenericListOptions,
  GenericListOptionSettings,
  GenericListSettings,
} from "./_generic_list.ts";
import { GenericPrompt } from "./_generic_prompt.ts";

/** Checkbox prompt options. */
export interface CheckboxOptions
  extends GenericListOptions<Array<string>, Array<string>> {
  options: Array<string | CheckboxOption>;
  check?: string;
  uncheck?: string;
  minOptions?: number;
  maxOptions?: number;
  keys?: CheckboxKeys;
}

/** Checkbox prompt settings. */
interface CheckboxSettings
  extends GenericListSettings<Array<string>, Array<string>> {
  options: Array<CheckboxOptionSettings>;
  check: string;
  uncheck: string;
  minOptions: number;
  maxOptions: number;
  keys?: CheckboxKeys;
}

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

/** Checkbox key options. */
export interface CheckboxKeys extends GenericListKeys {
  check?: Array<string>;
}

/** Checkbox prompt representation. */
export class Checkbox extends GenericList<Array<string>, Array<string>> {
  protected readonly settings: CheckboxSettings;
  protected options: Array<CheckboxOptionSettings>;
  protected listIndex: number;
  protected listOffset: number;

  /** Execute the prompt and show cursor on end. */
  public static prompt(options: CheckboxOptions): Promise<Array<string>> {
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
  public static inject(value: Array<string>): void {
    GenericPrompt.inject(value);
  }

  constructor(options: CheckboxOptions) {
    super();
    this.settings = this.getDefaultSettings(options);
    this.options = this.settings.options.slice();
    this.listIndex = this.getListIndex();
    this.listOffset = this.getPageOffset(this.listIndex);
  }

  protected getDefaultSettings(options: CheckboxOptions): CheckboxSettings {
    const settings = super.getDefaultSettings(options);
    return {
      ...settings,
      check: options.check ?? green(Figures.TICK),
      uncheck: options.uncheck ?? red(Figures.CROSS),
      minOptions: options.minOptions ?? 0,
      maxOptions: options.maxOptions ?? Infinity,
      options: this.mapOptions(options, options.options),
      keys: {
        check: ["space"],
        ...(settings.keys ?? {}),
      },
    };
  }

  /**
   * Map string option values to options and set option defaults.
   * @param promptOptions Checkbox options.
   */
  protected mapOptions(
    promptOptions: CheckboxOptions,
    options: Array<string | CheckboxOption>,
  ): Array<CheckboxOptionSettings> {
    return super.mapOptions(promptOptions, options).map(
      (option) => this.mapOption(promptOptions, option),
    );
  }

  /**
   * Set list option defaults.
   * @param option List option.
   */
  protected mapOption(
    options: CheckboxOptions,
    option: CheckboxOption,
  ): CheckboxOptionSettings {
    return {
      ...super.mapOption(options, option),
      checked: typeof option.checked === "undefined" && options.default &&
          options.default.indexOf(option.value) !== -1
        ? true
        : !!option.checked,
      icon: typeof option.icon === "undefined" ? true : option.icon,
    };
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
    line += `${
      isSelected && !item.disabled
        ? this.highlight(item.name, (val) => val)
        : this.highlight(item.name)
    }`;

    return line;
  }

  /** Get value of checked options. */
  protected getValue(): Array<string> {
    return this.settings.options
      .filter((item) => item.checked)
      .map((item) => item.value);
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
    const item = this.options[this.listIndex];
    if (item.disabled) {
      this.setErrorMessage("This option is disabled and cannot be changed.");
    } else {
      item.checked = !item.checked;
    }
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: Array<string>): boolean | string {
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
  protected transform(value: Array<string>): Array<string> {
    return value.map((val) => val.trim());
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: Array<string>): string {
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
 * @deprecated Use `Array<CheckboxOptionSettings>` instead.
 */
export type CheckboxValueSettings = Array<CheckboxOptionSettings>;
