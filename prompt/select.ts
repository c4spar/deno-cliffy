import type { KeyEvent } from "../keycode/key_event.ts";
import { blue, dim } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericList,
  GenericListOption,
  GenericListOptions,
  GenericListOptionSettings,
  GenericListSettings,
} from "./_generic_list.ts";
import { GenericPrompt } from "./_generic_prompt.ts";

/** Select key options. */
export interface SelectKeys {
  previous?: string[];
  next?: string[];
  submit?: string[];
}

/** Select key settings. */
type SelectKeysSettings = Required<SelectKeys>;

/** Select option options. */
export type SelectOption = GenericListOption;

/** Select option settings. */
export type SelectOptionSettings = GenericListOptionSettings;

/** Select options type. */
export type SelectValueOptions = (string | SelectOption)[];
/** Select option settings type. */
export type SelectValueSettings = SelectOptionSettings[];

/** Select prompt options. */
export interface SelectOptions extends GenericListOptions<string, string> {
  options: SelectValueOptions;
  keys?: SelectKeys;
}

/** Select prompt settings. */
export interface SelectSettings extends GenericListSettings<string, string> {
  options: SelectValueSettings;
  keys: SelectKeysSettings;
}

/** Select prompt representation. */
export class Select extends GenericList<string, string, SelectSettings> {
  protected selected: number = typeof this.settings.default !== "undefined"
    ? this.settings.options.findIndex((item) =>
      item.name === this.settings.default
    ) || 0
    : 0;

  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Input value.
   */
  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

  /** Execute the prompt and show cursor on end. */
  public static async prompt(options: SelectOptions): Promise<string> {
    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      listPointer: blue(Figures.POINTER),
      indent: " ",
      maxRows: 10,
      ...options,
      keys: {
        previous: ["up", "u"],
        next: ["down", "d"],
        submit: ["return", "enter"],
        ...(options.keys ?? {}),
      },
      options: Select.mapOptions(options),
    }).prompt();
  }

  /**
   * Map string option values to options and set option defaults.
   * @param options List options.
   */
  protected static mapOptions(options: SelectOptions): SelectValueSettings {
    return this.mapValues(options.options).map((item) => this.mapItem(item));
  }

  /**
   * Map string option values to options.
   * @param optValues Select option.
   */
  protected static mapValues(optValues: SelectValueOptions): SelectOption[] {
    return super.mapValues(optValues) as SelectOption[];
  }

  /**
   * Set select option defaults.
   * @param item Select option.
   */
  protected static mapItem(item: SelectOption): SelectOptionSettings {
    return super.mapItem(item) as SelectOptionSettings;
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyEvent): Promise<boolean> {
    switch (true) {
      case event.name === "c":
        if (event.ctrl) {
          this.screen.cursorShow();
          return Deno.exit(0);
        }
        break;

      case this.isKey(this.settings.keys, "previous", event):
        await this.selectPrevious();
        break;

      case this.isKey(this.settings.keys, "next", event):
        await this.selectNext();
        break;

      case this.isKey(this.settings.keys, "submit", event):
        return true;
    }

    return false;
  }

  /** Get value of selected option. */
  protected getValue(): string {
    return this.settings.options[this.selected].value;
  }

  /**
   * Render select option.
   * @param item        Select option settings.
   * @param isSelected  Set to true if option is selected.
   */
  protected writeListItem(item: SelectOptionSettings, isSelected?: boolean) {
    let line = this.settings.indent;

    // pointer
    line += isSelected ? `${this.settings.listPointer} ` : "  ";

    // value
    const value: string = item.name;
    line += `${isSelected ? value : dim(value)}`;

    this.writeLine(line);
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    return typeof value === "string" &&
      value.length > 0 &&
      this.settings.options.findIndex((option) => option.value === value) !==
        -1;
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
