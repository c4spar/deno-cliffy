import type { KeyEvent } from "../keycode/key-event.ts";
import { blue, dim } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericList,
  GenericListOption,
  GenericListOptions,
  GenericListOptionSettings,
  GenericListSettings,
} from "./_generic-list.ts";
import { GenericPrompt } from "./_generic-prompt.ts";

export type SelectOption = GenericListOption;

export type SelectOptionSettings = GenericListOptionSettings;

export type SelectValueOptions = (string | SelectOption)[];
export type SelectValueSettings = SelectOptionSettings[];

export interface SelectKeys {
  previous?: string[];
  next?: string[];
  submit?: string[];
}

type SelectKeysSettings = Required<SelectKeys>;

export interface SelectOptions extends GenericListOptions<string, string> {
  options: SelectValueOptions;
  keys?: SelectKeys;
}

export interface SelectSettings extends GenericListSettings<string, string> {
  options: SelectValueSettings;
  keys: SelectKeysSettings;
}

export class Select extends GenericList<string, string, SelectSettings> {
  protected selected: number = typeof this.settings.default !== "undefined"
    ? this.settings.options.findIndex((item) =>
      item.name === this.settings.default
    ) || 0
    : 0;

  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

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

  protected static mapOptions(options: SelectOptions): SelectValueSettings {
    return this.mapValues(options.options).map((item) => this.mapItem(item));
  }

  protected static mapValues(optValues: SelectValueOptions): SelectOption[] {
    return super.mapValues(optValues) as SelectOption[];
  }

  protected static mapItem(item: SelectOption): SelectOptionSettings {
    return super.mapItem(item) as SelectOptionSettings;
  }

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

  protected getValue(): string {
    return this.settings.options[this.selected].value;
  }

  protected writeListItem(item: SelectOptionSettings, isSelected?: boolean) {
    let line = this.settings.indent;

    // pointer
    line += isSelected ? `${this.settings.listPointer} ` : "  ";

    // value
    const value: string = item.name;
    line += `${isSelected ? value : dim(value)}`;

    this.writeLine(line);
  }

  protected validate(value: string): boolean | string {
    return typeof value === "string" &&
      value.length > 0 &&
      this.settings.options.findIndex((option) => option.value === value) !==
        -1;
  }

  protected transform(value: string): string {
    return value.trim();
  }

  protected format(value: string): string {
    return this.getOptionByValue(value)?.name ?? value;
  }
}
