import type { KeyCode } from "../keycode/key_code.ts";
import {
  GenericInput,
  GenericInputKeys,
  GenericInputPromptOptions,
} from "./_generic_input.ts";
import { blue, bold, dim, stripColor } from "./deps.ts";
import { Figures, getFiguresByKeys } from "./figures.ts";
import { distance } from "../_utils/distance.ts";

type UnsupportedInputOptions = "suggestions" | "list";

/** Generic list prompt options. */
export interface GenericListOptions<
  TValue,
  TRawValue,
  TOption extends GenericListOption,
> extends
  Omit<
    GenericInputPromptOptions<TValue, TRawValue>,
    UnsupportedInputOptions
  > {
  options: Array<string | TOption>;
  keys?: GenericListKeys;
  indent?: string;
  listPointer?: string;
  searchIcon?: string;
  maxRows?: number;
  searchLabel?: string;
  search?: boolean;
  info?: boolean;
}

/** Generic list option options. */
export interface GenericListOption {
  value: string;
  name?: string;
  disabled?: boolean;
}

/** Select key options. */
export interface GenericListKeys extends GenericInputKeys {
  previous?: string[];
  next?: string[];
  previousPage?: string[];
  nextPage?: string[];
}

/** Generic list prompt representation. */
export abstract class GenericList<
  TValue,
  TRawValue,
  TOptions extends GenericListOptions<TValue, TRawValue, TOption>,
  TOption extends GenericListOption,
> extends GenericInput<TValue, TRawValue, TOptions> {
  protected readonly originalOptions: ReadonlyArray<TOption>;
  protected options: Array<TOption>;
  protected listIndex: number;
  protected listOffset: number;

  /**
   * Create list separator.
   * @param label Separator label.
   */
  public static separator(label = "------------"): GenericListOption {
    return { value: label, disabled: true };
  }

  protected constructor(options: TOptions) {
    super({
      listPointer: blue(Figures.POINTER),
      searchLabel: blue(Figures.SEARCH),
      maxRows: 10,
      ...options,
      keys: {
        previous: options.search ? ["up"] : ["up", "u", "p", "8"],
        next: options.search ? ["down"] : ["down", "d", "n", "2"],
        previousPage: ["pageup", "left"],
        nextPage: ["pagedown", "right"],
        ...(options.keys ?? {}),
      },
    });
    this.originalOptions = this.mapOptions(options);
    this.options = this.originalOptions.slice();
    this.listIndex = this.getListIndex();
    this.listOffset = this.getPageOffset(this.listIndex);
  }

  protected abstract mapOptions(options: TOptions): Array<TOption>;

  protected match(): void {
    const input: string = this.getCurrentInputValue().toLowerCase();
    if (!input.length) {
      this.options = this.originalOptions.slice();
    } else {
      this.options = this.originalOptions
        .filter((option: TOption) =>
          (option.name && match(option.name)) ||
          (option.name !== option.value && match(option.value))
        )
        .sort((a: TOption, b: TOption) =>
          distance(a.name || a.value, input) -
          distance(b.name || b.value, input)
        );
    }
    this.listIndex = Math.max(
      0,
      Math.min(this.options.length - 1, this.listIndex),
    );
    this.listOffset = Math.max(
      0,
      Math.min(
        this.options.length - this.getListHeight(),
        this.listOffset,
      ),
    );

    function match(value: string): boolean {
      return stripColor(value)
        .toLowerCase()
        .includes(input);
    }
  }

  protected message(): string {
    let message = `${this.settings.indent ?? ""}${this.settings.prefix ?? ""}` +
      bold(this.settings.message) +
      this.defaults();
    if (this.settings.search) {
      message += " ";
      if (this.settings.searchLabel) {
        message += this.settings.searchLabel + " ";
      }
    }
    this.cursor.x = stripColor(message).length + this.inputIndex + 1;
    return message + this.input();
  }

  /** Render options. */
  protected body(): string | Promise<string> {
    return this.getList() + this.getInfo();
  }

  protected getInfo(): string {
    if (!this.settings.info) {
      return "";
    }
    const selected: number = this.listIndex + 1;
    const actions: Array<[string, Array<string>]> = [
      ["Next", getFiguresByKeys(this.settings.keys?.next ?? [])],
      ["Previous", getFiguresByKeys(this.settings.keys?.previous ?? [])],
      ["Next Page", getFiguresByKeys(this.settings.keys?.nextPage ?? [])],
      [
        "Previous Page",
        getFiguresByKeys(this.settings.keys?.previousPage ?? []),
      ],
      ["Submit", getFiguresByKeys(this.settings.keys?.submit ?? [])],
    ];

    return "\n" + (this.settings.indent ?? "") + blue(Figures.INFO) +
      bold(` ${selected}/${this.options.length} `) +
      actions
        .map((cur) => `${cur[0]}: ${bold(cur[1].join(", "))}`)
        .join(", ");
  }

  /** Render options list. */
  protected getList(): string {
    const list: Array<string> = [];
    const height: number = this.getListHeight();
    for (let i = this.listOffset; i < this.listOffset + height; i++) {
      list.push(
        this.getListItem(
          this.options[i],
          this.listIndex === i,
        ),
      );
    }
    if (!list.length) {
      list.push(
        (this.settings.indent ?? "") + dim("  No matches..."),
      );
    }
    return list.join("\n");
  }

  /**
   * Render option.
   * @param option        Option.
   * @param isSelected  Set to true if option is selected.
   */
  protected abstract getListItem(
    option: TOption,
    isSelected?: boolean,
  ): string;

  /** Get options row height. */
  protected getListHeight(): number {
    return Math.min(
      this.options.length,
      this.settings.maxRows || this.options.length,
    );
  }

  protected getListIndex(value?: string) {
    return Math.max(
      0,
      typeof value === "undefined"
        ? this.options.findIndex((option: TOption) => !option.disabled) || 0
        : this.options.findIndex((option: TOption) => option.value === value) ||
          0,
    );
  }

  protected getPageOffset(index: number) {
    if (index === 0) {
      return 0;
    }
    const height: number = this.getListHeight();
    return Math.floor(index / height) * height;
  }

  /**
   * Find option by value.
   * @param value Value of the option.
   */
  protected getOptionByValue(
    value: string,
  ): TOption | undefined {
    return this.options.find((option) => option.value === value);
  }

  /** Read user input. */
  protected read(): Promise<boolean> {
    if (!this.settings.search) {
      this.tty.cursorHide();
    }
    return super.read();
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyCode): Promise<void> {
    switch (true) {
      case this.isKey(this.settings.keys, "previous", event):
        this.selectPrevious();
        break;
      case this.isKey(this.settings.keys, "next", event):
        this.selectNext();
        break;
      case this.isKey(this.settings.keys, "nextPage", event):
        this.selectNextPage();
        break;
      case this.isKey(this.settings.keys, "previousPage", event):
        this.selectPreviousPage();
        break;
      default:
        await super.handleEvent(event);
    }
  }

  protected moveCursorLeft(): void {
    if (this.settings.search) {
      super.moveCursorLeft();
    }
  }

  protected moveCursorRight(): void {
    if (this.settings.search) {
      super.moveCursorRight();
    }
  }

  protected deleteChar(): void {
    if (this.settings.search) {
      super.deleteChar();
    }
  }

  protected deleteCharRight(): void {
    if (this.settings.search) {
      super.deleteCharRight();
      this.match();
    }
  }

  protected addChar(char: string): void {
    if (this.settings.search) {
      super.addChar(char);
      this.match();
    }
  }

  /** Select previous option. */
  protected selectPrevious(): void {
    if (this.options.length < 2) {
      return;
    }
    if (this.listIndex > 0) {
      this.listIndex--;
      if (this.listIndex < this.listOffset) {
        this.listOffset--;
      }
      if (this.options[this.listIndex].disabled) {
        this.selectPrevious();
      }
    } else {
      this.listIndex = this.options.length - 1;
      this.listOffset = this.options.length - this.getListHeight();
      if (this.options[this.listIndex].disabled) {
        this.selectPrevious();
      }
    }
  }

  /** Select next option. */
  protected selectNext(): void {
    if (this.options.length < 2) {
      return;
    }
    if (this.listIndex < this.options.length - 1) {
      this.listIndex++;
      if (this.listIndex >= this.listOffset + this.getListHeight()) {
        this.listOffset++;
      }
      if (this.options[this.listIndex].disabled) {
        this.selectNext();
      }
    } else {
      this.listIndex = this.listOffset = 0;
      if (this.options[this.listIndex].disabled) {
        this.selectNext();
      }
    }
  }

  /** Select previous page. */
  protected selectPreviousPage(): void {
    if (this.options?.length) {
      const height: number = this.getListHeight();
      if (this.listOffset >= height) {
        this.listIndex -= height;
        this.listOffset -= height;
      } else if (this.listOffset > 0) {
        this.listIndex -= this.listOffset;
        this.listOffset = 0;
      }
    }
  }

  /** Select next page. */
  protected selectNextPage(): void {
    if (this.options?.length) {
      const height: number = this.getListHeight();
      if (this.listOffset + height + height < this.options.length) {
        this.listIndex += height;
        this.listOffset += height;
      } else if (this.listOffset + height < this.options.length) {
        const offset = this.options.length - height;
        this.listIndex += offset - this.listOffset;
        this.listOffset = offset;
      }
    }
  }
}

/** @deprecated Use `Array<string | GenericListOption>` instead. */
export type GenericListValueOptions = Array<string | GenericListOption>;

/** @deprecated Use `Array<GenericListOption>` instead. */
export type GenericListValueSettings = Array<GenericListOption>;

/** @deprecated Use `Array<GenericListOption>` instead. */
export type GenericListOptionSettings = GenericListOption;
