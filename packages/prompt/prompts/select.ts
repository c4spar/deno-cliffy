import { blue, dim } from "https://deno.land/std@v0.52.0/fmt/colors.ts";
import { KeyEvent } from "../../keycode/lib/key-event.ts";
import { Figures } from "../lib/figures.ts";
import {
  GenericList,
  GenericListOption,
  GenericListOptions,
  GenericListOptionSettings,
  GenericListSettings,
} from "../lib/generic-list.ts";
import { GenericPrompt } from "../lib/generic-prompt.ts";

export interface SelectOption extends GenericListOption {}

export interface SelectOptionSettings extends GenericListOptionSettings {}

export type SelectValueOptions = (string | SelectOption)[];
export type SelectValueSettings = SelectOptionSettings[];

export interface SelectOptions extends GenericListOptions<string, string> {}

export interface SelectSettings extends GenericListSettings<string, string> {}

export class Select<S extends SelectSettings>
  extends GenericList<string, string, S> {
  protected selected: number = typeof this.settings.default !== "undefined"
    ? this.settings.options.findIndex((item) =>
      item.name === this.settings.default
    ) || 0
    : 0;

  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

  public static async prompt(options: SelectOptions): Promise<string> {
    const items: SelectOption[] = this.mapValues(options.options);
    const values: SelectValueSettings = items.map((item) => this.mapItem(item));

    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      listPointer: blue(Figures.POINTER),
      indent: " ",
      maxRows: 10,
      ...options,
      options: values,
    }).prompt();
  }

  protected static mapValues(optValues: SelectValueOptions): SelectOption[] {
    return super.mapValues(optValues) as SelectOption[];
  }

  protected static mapItem(item: SelectOption): SelectOptionSettings {
    return super.mapItem(item) as SelectOptionSettings;
  }

  protected async handleEvent(event: KeyEvent): Promise<boolean> {
    switch (event.name) {
      case "c":
        if (event.ctrl) {
          return Deno.exit(0);
        }
        break;

      case "up":
        await this.selectPrevious();
        break;

      case "down":
        await this.selectNext();
        break;

      case "return":
      case "enter":
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

  protected validate(value: string): boolean {
    return typeof value === "string" &&
      value.length > 0 &&
      this.settings.options.findIndex((option) => option.value === value) !==
        -1;
  }

  protected transform(value: string): string {
    return value.trim();
  }

  protected format(value: string): string {
    return value;
  }
}
