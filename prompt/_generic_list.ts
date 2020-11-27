import {
  GenericPrompt,
  GenericPromptOptions,
  GenericPromptSettings,
} from "./_generic_prompt.ts";

/** Generic list option options. */
export interface GenericListOption {
  value: string;
  name?: string;
  disabled?: boolean;
}

/** Generic list option settings. */
export interface GenericListOptionSettings extends GenericListOption {
  name: string;
  value: string;
  disabled: boolean;
}

export type GenericListValueOptions = (string | GenericListOption)[];
export type GenericListValueSettings = GenericListOptionSettings[];

/** Generic list prompt options. */
export interface GenericListOptions<T, V> extends GenericPromptOptions<T, V> {
  options: GenericListValueOptions;
  indent?: string;
  listPointer?: string;
  maxRows?: number;
}

/** Generic list prompt settings. */
export interface GenericListSettings<T, V> extends GenericPromptSettings<T, V> {
  options: GenericListValueSettings;
  indent: string;
  listPointer: string;
  maxRows: number;
}

/** Generic list prompt representation. */
export abstract class GenericList<T, V, S extends GenericListSettings<T, V>>
  extends GenericPrompt<T, V, S> {
  protected index = 0;
  protected selected = 0;

  /**
   * Create list separator.
   * @param label Separator label.
   */
  public static separator(label = "------------"): GenericListOption {
    return { value: label, disabled: true };
  }

  /**
   * Set list option defaults.
   * @param item List option.
   */
  protected static mapItem(item: GenericListOption): GenericListOptionSettings {
    return {
      value: item.value,
      name: typeof item.name === "undefined" ? item.value : item.name,
      disabled: !!item.disabled,
    };
  }

  /**
   * Set prompt message.
   * @param message Prompt message.
   */
  protected render(message: string): void {
    this.writeLine(message);
    this.writeListItems();
  }

  /** Clear prompt output. */
  protected clear(): void {
    // clear list
    this.screen.eraseLines(this.height() + 2);
    // clear message and reset cursor
    super.clear();
  }

  /** Read user input. */
  protected read(): Promise<boolean> {
    this.screen.cursorHide();
    return super.read();
  }

  /** Select previous option. */
  protected selectPrevious(): void {
    if (this.selected > 0) {
      this.selected--;
      if (this.selected < this.index) {
        this.index--;
      }
      if (this.settings.options[this.selected].disabled) {
        this.selectPrevious();
      }
    } else {
      this.selected = this.settings.options.length - 1;
      this.index = this.settings.options.length - this.height();
      if (this.settings.options[this.selected].disabled) {
        this.selectPrevious();
      }
    }
  }

  /** Select next option. */
  protected selectNext(): void {
    if (this.selected < this.settings.options.length - 1) {
      this.selected++;
      if (this.selected >= this.index + this.height()) {
        this.index++;
      }
      if (this.settings.options[this.selected].disabled) {
        this.selectNext();
      }
    } else {
      this.selected = this.index = 0;
      if (this.settings.options[this.selected].disabled) {
        this.selectNext();
      }
    }
  }

  /** Render options. */
  protected writeListItems(): void {
    for (let i = this.index; i < this.index + this.height(); i++) {
      this.writeListItem(this.settings.options[i], this.selected === i);
    }
  }

  /**
   * Render option.
   * @param item        Option.
   * @param isSelected  Set to true if option is selected.
   */
  protected abstract writeListItem(
    item: GenericListOptionSettings,
    isSelected?: boolean,
  ): void;

  /** Get options row height. */
  protected height(): number {
    return Math.min(
      this.settings.options.length,
      this.settings.maxRows || this.settings.options.length,
    );
  }

  /**
   * Find option by value.
   * @param value Value of the option.
   */
  protected getOptionByValue(
    value: string,
  ): GenericListOptionSettings | undefined {
    return this.settings.options.find((option) => option.value === value);
  }
}
