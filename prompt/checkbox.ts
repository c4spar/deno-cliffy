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
  ParentOptions,
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
  extends
    GenericListSettings<Array<string>, Array<string>, CheckboxOptionSettings> {
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
export class Checkbox
  extends GenericList<Array<string>, Array<string>, CheckboxOptionSettings> {
  protected readonly settings: CheckboxSettings;
  protected options: Array<CheckboxOptionSettings>;
  protected parentOptions: Array<ParentOptions<CheckboxOptionSettings>> = [];
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
    return options.map((option) =>
      this.mapOption(
        promptOptions,
        typeof option === "string" ? { value: option } : option,
      )
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
      ...super.mapOption(options, option, false),
      options: option.options ? this.mapOptions(options, option.options) : [],
      checked: typeof option.checked === "undefined" && options.default &&
          options.default.indexOf(option.value) !== -1
        ? true
        : !!option.checked,
      icon: typeof option.icon === "undefined" ? true : option.icon,
    };
  }

  protected getListItemIcon(option: CheckboxOptionSettings): string {
    return this.getCheckboxIcon(option) + super.getListItemIcon(option);
  }

  private getCheckboxIcon(option: CheckboxOptionSettings): string {
    if (!option.icon) {
      return " ";
    }
    const icon = option.checked
      ? this.settings.check + " "
      : this.settings.uncheck + " ";

    return option.disabled ? dim(icon) : icon;
  }

  /** Get value of checked options. */
  protected getValue(): Array<string> {
    return this.flatOptions(this.settings.options, false)
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
      return;
    }
    this.checkOption(option, !option.checked);
    this.checkParentOptions();
  }

  private checkOption(option: CheckboxOptionSettings, checked: boolean) {
    option.checked = checked;
    for (const childOption of option.options) {
      this.checkOption(childOption, checked);
    }
  }

  private checkParentOptions() {
    for (let i = this.parentOptions.length - 1; i >= 0; i--) {
      const parentOption = this.getParentOption(i);
      if (parentOption) {
        parentOption.checked = parentOption.options.every((opt) => opt.checked);
      }
    }
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: Array<string>): boolean | string {
    const options = this.flatOptions(this.settings.options, false);
    const isValidValue = Array.isArray(value) &&
      value.every((val) =>
        typeof val === "string" &&
        val.length > 0 &&
        options.findIndex((option: CheckboxOptionSettings) =>
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
