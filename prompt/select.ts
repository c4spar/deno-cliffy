import { brightBlue, underline } from "./deps.ts";
import {
  GenericList,
  GenericListKeys,
  GenericListOption,
  GenericListOptionGroup,
  GenericListOptionGroupSettings,
  GenericListOptions,
  GenericListOptionSettings,
  GenericListSettings,
  isOption,
  isOptionGroup,
} from "./_generic_list.ts";
import { GenericPrompt } from "./_generic_prompt.ts";
import { getFiguresByKeys } from "./_figures.ts";

/** Select prompt options. */
export interface SelectOptions extends GenericListOptions<string, string> {
  options: Array<string | SelectOption | SelectOptionGroup>;
  keys?: SelectKeys;
}

/** Select prompt settings. */
export interface SelectSettings extends
  GenericListSettings<
    string,
    string,
    SelectOptionSettings,
    SelectOptionGroupSettings
  > {
  keys: SelectKeys;
}

/** Select option options. */
export type SelectOption = GenericListOption;

/** Select option group options. */
export type SelectOptionGroup = GenericListOptionGroup<GenericListOption>;

/** Select option settings. */
export type SelectOptionSettings = GenericListOptionSettings;

/** Select option group settings. */
export type SelectOptionGroupSettings = GenericListOptionGroupSettings<
  SelectOptionSettings
>;

/** Select key options. */
export type SelectKeys = GenericListKeys;

/** Select prompt representation. */
export class Select extends GenericList<
  string,
  string,
  SelectOptionSettings,
  SelectOptionGroupSettings
> {
  protected readonly settings: SelectSettings;
  protected options: Array<SelectOptionSettings | SelectOptionGroupSettings>;
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
      options: this.mapOptions(options, options.options),
    };
  }

  /**
   * Map string option values to options and set option defaults.
   * @param promptOptions Select options.
   */
  protected mapOptions(
    promptOptions: SelectOptions,
    options: Array<string | SelectOption | SelectOptionGroup>,
  ): Array<SelectOptionSettings | SelectOptionGroupSettings> {
    return options.map((option) =>
      isOptionGroup(option)
        ? this.mapOptionGroup(promptOptions, option)
        : typeof option === "string"
        ? this.mapOption(promptOptions, { value: option })
        : this.mapOption(promptOptions, option)
    );
  }

  protected input(): string {
    return underline(brightBlue(this.inputValue));
  }

  protected async submit(): Promise<void> {
    if (
      this.isBackButton(this.selectedOption) ||
      isOptionGroup(this.selectedOption)
    ) {
      const info = isOptionGroup(this.selectedOption)
        ? ` To select a group use ${
          getFiguresByKeys(this.settings.keys.open ?? []).join(", ")
        }.`
        : "";
      this.setErrorMessage(`No option selected.${info}`);
      return;
    }

    await super.submit();
  }

  /** Get value of selected option. */
  protected getValue(): string {
    const option = this.options[this.listIndex];
    assertIsOption(option);
    return option?.value ?? this.settings.default;
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    return typeof value === "string" &&
      value.length > 0 &&
      this.options.findIndex((
          option: SelectOptionSettings | SelectOptionGroupSettings,
        ) => isOption(option) && option.value === value
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

function assertIsOption<
  TOption extends GenericListOption,
>(
  option: TOption | GenericListOptionGroup<GenericListOption>,
): asserts option is TOption {
  if (!isOption(option)) {
    throw new Error("Expected an option but got an option group.");
  }
}

/**
 * Select options type.
 * @deprecated Use `Array<string | SelectOption | SelectOptionGroup>` instead.
 */
export type SelectValueOptions = Array<
  string | SelectOption | SelectOptionGroup
>;

/**
 * Select option settings type.
 * @deprecated Use `Array<SelectOptionSettings | SelectOptionGroupSettings>` instead.
 */
export type SelectValueSettings = Array<
  SelectOptionSettings | SelectOptionGroupSettings
>;
