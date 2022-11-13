import { blue, underline } from "./deps.ts";
import {
  GenericList,
  GenericListKeys,
  GenericListOption,
  GenericListOptions,
} from "./_generic_list.ts";
import { GenericPrompt } from "./_generic_prompt.ts";

/** Select prompt options. */
export interface SelectOptions
  extends GenericListOptions<string, string, SelectOption> {
  options: Array<string | SelectOption>;
  keys?: SelectKeys;
}

/** Select option options. */
export type SelectOption = GenericListOption;

/** Select key options. */
export type SelectKeys = GenericListKeys;

/** Select prompt representation. */
export class Select
  extends GenericList<string, string, SelectOptions, SelectOption> {
  protected listIndex: number = this.getListIndex(this.settings.default);

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
    super(options);
  }

  protected mapOptions(options: SelectOptions): Array<SelectOption> {
    return options.options.map((option: string | SelectOption) =>
      typeof option === "string" ? { value: option } : option
    );
  }

  protected input(): string {
    return underline(blue(this.inputValue));
  }

  /**
   * Render select option.
   * @param option      Select option settings.
   * @param isSelected  Set to true if option is selected.
   */
  protected getListItem(
    option: SelectOption,
    isSelected?: boolean,
  ): string {
    let line = this.settings.indent ?? "";
    line += isSelected && this.settings.listPointer
      ? `${this.settings.listPointer} `
      : "  ";
    line += `${
      isSelected && !option.disabled
        ? this.highlight(option.name || option.value, (val) => val)
        : this.highlight(option.name || option.value)
    }`;
    return line;
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
      this.options.findIndex((option: SelectOption) =>
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
 * @deprecated Use `Array<SelectOption>` instead.
 */
export type SelectValueSettings = Array<SelectOption>;

/**
 * Select option settings.
 * @deprecated Use `SelectOption` instead.
 */
export type SelectOptionSettings = SelectOption;
