import {
  GenericPrompt,
  GenericPromptOptions,
  GenericPromptSettings,
} from "./_generic-prompt.ts";

export interface GenericListOption {
  value: string;
  name?: string;
  disabled?: boolean;
}

export interface GenericListOptionSettings extends GenericListOption {
  name: string;
  value: string;
  disabled: boolean;
}

export type GenericListValueOptions = (string | GenericListOption)[];
export type GenericListValueSettings = GenericListOptionSettings[];

export interface GenericListOptions<T, V> extends GenericPromptOptions<T, V> {
  options: GenericListValueOptions;
  indent?: string;
  listPointer?: string;
  maxRows?: number;
}

export interface GenericListSettings<T, V> extends GenericPromptSettings<T, V> {
  options: GenericListValueSettings;
  indent: string;
  listPointer: string;
  maxRows: number;
}

export abstract class GenericList<T, V, S extends GenericListSettings<T, V>>
  extends GenericPrompt<T, V, S> {
  protected index = 0;
  protected selected = 0;

  public static separator(label = "------------"): GenericListOption {
    return { value: label, disabled: true };
  }

  protected static mapValues(
    optValues: GenericListValueOptions,
  ): GenericListOption[] {
    return Object.values(optValues)
      .map((item: string | GenericListOption) =>
        typeof item === "string" ? { value: item } : item
      );
  }

  protected static mapItem(item: GenericListOption): GenericListOptionSettings {
    return {
      value: item.value,
      name: typeof item.name === "undefined" ? item.value : item.name,
      disabled: !!item.disabled,
    };
  }

  protected setPrompt(message: string) {
    this.writeLine(message);

    this.writeListItems();
  }

  protected clear() {
    // clear list
    this.screen.eraseLines(this.height() + 2);
    // clear message and reset cursor
    super.clear();
  }

  protected async read(): Promise<boolean> {
    this.screen.cursorHide();

    return super.read();
  }

  protected async selectPrevious(): Promise<void> {
    if (this.selected > 0) {
      this.selected--;
      if (this.selected < this.index) {
        this.index--;
      }
      if (this.settings.options[this.selected].disabled) {
        return this.selectPrevious();
      }
    } else {
      this.selected = this.settings.options.length - 1;
      this.index = this.settings.options.length - this.height();
      if (this.settings.options[this.selected].disabled) {
        return this.selectPrevious();
      }
    }
  }

  protected async selectNext(): Promise<void> {
    if (this.selected < this.settings.options.length - 1) {
      this.selected++;
      if (this.selected >= this.index + this.height()) {
        this.index++;
      }
      if (this.settings.options[this.selected].disabled) {
        return this.selectNext();
      }
    } else {
      this.selected = this.index = 0;
      if (this.settings.options[this.selected].disabled) {
        return this.selectNext();
      }
    }
  }

  protected writeListItems() {
    for (let i = this.index; i < this.index + this.height(); i++) {
      this.writeListItem(this.settings.options[i], this.selected === i);
    }
  }

  protected abstract writeListItem(
    item: GenericListOptionSettings,
    isSelected?: boolean,
  ): void;

  protected height() {
    return Math.min(
      this.settings.options.length,
      this.settings.maxRows || this.settings.options.length,
    );
  }

  protected getOptionByValue(value: string) {
    return this.settings.options.find((option) => option.value === value);
  }
}
