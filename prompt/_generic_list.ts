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
   * @param option List option.
   */
  protected static mapOption(
    option: GenericListOption,
  ): GenericListOptionSettings {
    return {
      value: option.value,
      name: typeof option.name === "undefined" ? option.value : option.name,
      disabled: !!option.disabled,
    };
  }

  /** Render options. */
  protected body(): string | undefined | Promise<string | undefined> {
    const body: Array<string> = [];
    const height: number = this.getListHeight();
    for (let i = this.index; i < this.index + height; i++) {
      body.push(
        this.getListItem(
          this.settings.options[i],
          this.selected === i,
        ),
      );
    }
    return body.join("\n");
  }

  /**
   * Render option.
   * @param item        Option.
   * @param isSelected  Set to true if option is selected.
   */
  protected abstract getListItem(
    item: GenericListOptionSettings,
    isSelected?: boolean,
  ): string;

  /** Read user input. */
  protected read(): Promise<boolean> {
    this.tty.cursorHide();
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
      this.index = this.settings.options.length - this.getListHeight();
      if (this.settings.options[this.selected].disabled) {
        this.selectPrevious();
      }
    }
  }

  /** Select next option. */
  protected selectNext(): void {
    if (this.selected < this.settings.options.length - 1) {
      this.selected++;
      if (this.selected >= this.index + this.getListHeight()) {
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

  /** Get options row height. */
  protected getListHeight(): number {
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
