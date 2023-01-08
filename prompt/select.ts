import { brightBlue, underline } from "./deps.ts";
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

/** Select prompt options. */
export interface SelectOptions extends GenericListOptions<string, string> {
  options: Array<string | SelectOption>;
  keys?: SelectKeys;
}

/** Select prompt settings. */
export interface SelectSettings
  extends GenericListSettings<string, string, SelectOptionSettings> {
  keys?: SelectKeys;
}

/** Select option options. */
export type SelectOption = GenericListOption;

/** Select option settings. */
export type SelectOptionSettings = GenericListOptionSettings;

/** Select key options. */
export type SelectKeys = GenericListKeys;

/** Select prompt representation. */
export class Select extends GenericList<string, string, SelectOptionSettings> {
  protected readonly settings: SelectSettings;
  protected options: Array<SelectOptionSettings>;
  protected parentOptions: Array<ParentOptions<SelectOptionSettings>> = [];
  protected listIndex: number;
  protected listOffset: number;

  /** Execute the prompt and show cursor on end. */
  public static prompt(options: SelectOptions): Promise<string> {
    return new this(options).prompt();
  }

  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Input value.
   */
  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

  constructor(options: SelectOptions) {
    super();
    this.settings = this.getDefaultSettings(options);
    this.options = this.settings.options.slice();
    this.listIndex = this.getListIndex(this.settings.default);
    this.listOffset = this.getPageOffset(this.listIndex);
  }

  protected getDefaultSettings(options: SelectOptions): SelectSettings {
    return {
      ...super.getDefaultSettings(options),
      options: this.mapOptions(options, options.options).map(
        (option) => this.mapOption(options, option),
      ),
    };
  }

  /**
   * Map string option values to options and set option defaults.
   * @param promptOptions Select options.
   */
  protected mapOptions(
    promptOptions: SelectOptions,
    options: Array<string | SelectOption>,
  ): Array<SelectOptionSettings> {
    return options.map(
      (option) =>
        this.mapOption(
          promptOptions,
          typeof option === "string" ? { value: option } : option,
        ),
    );
  }

  protected input(): string {
    return underline(brightBlue(this.inputValue));
  }

  /** Get value of selected option. */
  protected getValue(): string {
    return this.options[this.listIndex]?.value ?? this.settings.default;
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    return typeof value === "string" &&
      value.length > 0 &&
      this.options.findIndex((option: SelectOptionSettings) =>
          option.value === value
        ) !== -1;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): string {
    return value.trim();
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: string): string {
    return this.getOptionByValue(value)?.name ?? value;
  }
}

/**
 * Select options type.
 * @deprecated Use `Array<string | SelectOption>` instead.
 */
export type SelectValueOptions = Array<string | SelectOption>;

/**
 * Select option settings type.
 * @deprecated Use `Array<SelectOptionSettings>` instead.
 */
export type SelectValueSettings = Array<SelectOptionSettings>;
