import type { KeyEvent } from "../keycode/key_event.ts";
import { blue, dim, underline } from "./deps.ts";
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

/** Select key options. */
export interface SelectKeys extends GenericListKeys {
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
export class Select<S extends SelectSettings = SelectSettings>
  extends GenericList<string, string, S> {
  protected listIndex: number = typeof this.settings.default !== "undefined"
    ? this.options.findIndex((item: SelectOptionSettings) =>
      item.value === this.settings.default
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
  public static prompt(options: SelectOptions): Promise<string> {
    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      listPointer: blue(Figures.POINTER),
      indent: " ",
      maxRows: 10,
      ...options,
      keys: {
        moveCursorLeft: ["left"],
        moveCursorRight: ["right"],
        deleteCharLeft: ["backspace"],
        deleteCharRight: ["delete"],
        previous: options.filter ? ["up"] : ["up", "u", "8"],
        next: options.filter ? ["down"] : ["down", "d", "2"],
        submit: ["return", "enter"],
        ...(options.keys ?? {}),
      },
      options: Select.mapOptions(options),
    }).prompt();
  }

  protected static mapOptions(options: SelectOptions): SelectValueSettings {
    return options.options
      .map((item: string | SelectOption) =>
        typeof item === "string" ? { value: item } : item
      )
      .map((item) => this.mapOption(item));
  }

  protected input(): string {
    return underline(blue(this.inputValue));
  }

  /**
   * Render select option.
   * @param item        Select option settings.
   * @param isSelected  Set to true if option is selected.
   */
  protected getListItem(
    item: SelectOptionSettings,
    isSelected?: boolean,
  ): string {
    let line = this.settings.indent;
    line += isSelected ? `${this.settings.listPointer} ` : "  ";
    line += `${isSelected ? item.name : dim(item.name)}`;
    return line;
  }

  /** Get value of selected option. */
  protected getValue(): string {
    return this.options[this.listIndex]?.value ?? this.settings.default;
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyEvent): Promise<void> {
    switch (true) {
      case event.name === "c":
        if (event.ctrl) {
          this.tty.cursorShow();
          return Deno.exit(0);
        }
        break;

      case this.settings.filter &&
        this.isKey(this.settings.keys, "moveCursorLeft", event):
        this.moveCursorLeft();
        break;

      case this.settings.filter &&
        this.isKey(this.settings.keys, "moveCursorRight", event):
        this.moveCursorRight();
        break;

      case this.settings.filter &&
        this.isKey(this.settings.keys, "deleteCharRight", event):
        this.deleteCharRight();
        this.match();
        break;

      case this.settings.filter &&
        this.isKey(this.settings.keys, "deleteCharLeft", event):
        this.deleteChar();
        this.match();
        break;

      case this.isKey(this.settings.keys, "previous", event):
        this.selectPrevious();
        break;

      case this.isKey(this.settings.keys, "next", event):
        this.selectNext();
        break;

      case this.isKey(this.settings.keys, "submit", event):
        await this.submit();
        break;

      default:
        if (
          this.settings.filter && event.sequence && !event.meta && !event.ctrl
        ) {
          this.addChar(event.sequence);
          this.match();
        }
    }
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
