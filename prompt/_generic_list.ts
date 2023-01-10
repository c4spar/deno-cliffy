import type { KeyCode } from "../keycode/key_code.ts";
import {
  GenericInput,
  GenericInputKeys,
  GenericInputPromptOptions,
  GenericInputPromptSettings,
} from "./_generic_input.ts";
import { bold, brightBlue, dim, stripColor, yellow } from "./deps.ts";
import { Figures, getFiguresByKeys } from "./figures.ts";
import { distance } from "../_utils/distance.ts";

type UnsupportedInputOptions = "suggestions" | "list";

/** Generic list prompt options. */
export interface GenericListOptions<TValue, TRawValue> extends
  Omit<
    GenericInputPromptOptions<TValue, TRawValue>,
    UnsupportedInputOptions
  > {
  options: Array<
    string | GenericListOption | GenericListOptionGroup<GenericListOption>
  >;
  keys?: GenericListKeys;
  indent?: string;
  listPointer?: string;
  searchIcon?: string;
  maxRows?: number;
  searchLabel?: string;
  search?: boolean;
  info?: boolean;
  maxBreadcrumbItems?: number;
  breadcrumbSeparator?: string;
}

/** Generic list prompt settings. */
export interface GenericListSettings<
  TValue,
  TRawValue,
  TOption extends GenericListOptionSettings,
  TGroup extends GenericListOptionGroupSettings<TOption>,
> extends GenericInputPromptSettings<TValue, TRawValue> {
  options: Array<TOption | TGroup>;
  keys?: GenericListKeys;
  indent: string;
  listPointer: string;
  maxRows: number;
  searchLabel: string;
  search?: boolean;
  info?: boolean;
  maxBreadcrumbItems: number;
  breadcrumbSeparator: string;
  backPointer: string;
  groupPointer: string;
  groupIcon: string;
  groupOpenIcon: string;
}

/** Generic list option options. */
export interface GenericListOption {
  value: string;
  name?: string;
  disabled?: boolean;
}

/** Generic list option group options. */
export interface GenericListOptionGroup<TOption extends GenericListOption> {
  name: string;
  options: Array<string | TOption | this>;
  disabled?: boolean;
}

/** Generic list option settings. */
export interface GenericListOptionSettings extends GenericListOption {
  name: string;
  value: string;
  disabled: boolean;
  indentLevel: number;
}

/** Generic list option group settings. */
export interface GenericListOptionGroupSettings<
  TOption extends GenericListOptionSettings,
> extends GenericListOptionGroup<TOption> {
  disabled: boolean;
  indentLevel: number;
  options: Array<TOption | this>;
}

/** GenericList key options. */
export interface GenericListKeys extends GenericInputKeys {
  previous?: string[];
  next?: string[];
  previousPage?: string[];
  nextPage?: string[];
}

interface SortedOption<
  TOption extends GenericListOptionSettings,
  TGroup extends GenericListOptionGroupSettings<TOption>,
> {
  originalOption: TOption | TGroup;
  distance: number;
  children: Array<SortedOption<TOption, TGroup>>;
}

interface ParentOptions<
  TOption extends GenericListOptionSettings,
  TGroup extends GenericListOptionGroupSettings<TOption>,
> {
  options: Array<TOption | TGroup>;
  selectedCategoryIndex: number;
}

/** Generic list prompt representation. */
export abstract class GenericList<
  TValue,
  TRawValue,
  TOption extends GenericListOptionSettings,
  TGroup extends GenericListOptionGroupSettings<TOption>,
> extends GenericInput<TValue, TRawValue> {
  protected abstract readonly settings: GenericListSettings<
    TValue,
    TRawValue,
    TOption,
    TGroup
  >;
  protected abstract options: Array<TOption | TGroup>;
  protected abstract listIndex: number;
  protected abstract listOffset: number;
  protected parentOptions: Array<ParentOptions<TOption, TGroup>> = [];
  #backButton: TOption = {
    name: "",
    value: "",
    options: [],
    disabled: false,
    indentLevel: 0,
  } as unknown as TOption;

  /**
   * Create list separator.
   * @param label Separator label.
   */
  public static separator(label = "------------"): GenericListOption {
    return { value: label, disabled: true };
  }

  protected getDefaultSettings(
    options: GenericListOptions<TValue, TRawValue>,
  ): GenericListSettings<TValue, TRawValue, TOption, TGroup> {
    const settings = super.getDefaultSettings(options);
    return {
      listPointer: brightBlue(Figures.POINTER),
      searchLabel: brightBlue(Figures.SEARCH),
      backPointer: brightBlue(Figures.LEFT_POINTER),
      groupPointer: brightBlue(Figures.POINTER),
      groupIcon: Figures.FOLDER,
      groupOpenIcon: Figures.FOLDER_OPEN,
      maxBreadcrumbItems: 5,
      breadcrumbSeparator: "›",
      ...settings,
      maxRows: options.maxRows ?? 10,
      options: this.mapOptions(options, options.options),
      keys: {
        previous: options.search ? ["up"] : ["up", "u", "p", "8"],
        next: options.search ? ["down"] : ["down", "d", "n", "2"],
        previousPage: ["pageup", "left"],
        nextPage: ["pagedown", "right"],
        ...(settings.keys ?? {}),
      },
    };
  }

  protected abstract mapOptions(
    promptOptions: GenericListOptions<TValue, TRawValue>,
    options: Array<
      string | GenericListOption | GenericListOptionGroup<GenericListOption>
    >,
  ): Array<TOption | TGroup>;

  protected mapOption(
    _options: GenericListOptions<TValue, TRawValue>,
    option: GenericListOption,
  ): GenericListOptionSettings {
    return {
      value: option.value,
      name: typeof option.name === "undefined" ? option.value : option.name,
      disabled: !!option.disabled,
      indentLevel: 0,
    };
  }

  protected mapOptionGroup(
    options: GenericListOptions<TValue, TRawValue>,
    option: GenericListOptionGroup<GenericListOption>,
    recursive = true,
  ): GenericListOptionGroupSettings<GenericListOptionSettings> {
    return {
      name: option.name,
      disabled: !!option.disabled,
      indentLevel: 0,
      options: recursive ? this.mapOptions(options, option.options) : [],
    };
  }

  protected flatOptions(
    options: Array<TOption | TGroup>,
    groups: false,
  ): Array<TOption>;

  protected flatOptions(
    options: Array<TOption | TGroup>,
    groups?: boolean,
  ): Array<TOption | TGroup>;

  protected flatOptions(
    options: Array<TOption | TGroup>,
    groups = true,
  ): Array<TOption | TGroup> {
    const opts = [];

    for (const option of options) {
      if (isOption(option) || groups) {
        opts.push(option);
      }
      if (isOptionGroup(option)) {
        opts.push(...this.flatOptions(option.options, groups));
      }
    }

    return opts;
  }

  protected match(): void {
    const input: string = this.getCurrentInputValue().toLowerCase();

    if (!input.length) {
      this.options = this.getCurrentOptions().slice();
      if (this.hasParent()) {
        this.options.unshift(this.#backButton);
      }
    } else {
      const sortedHits = this.findSearchHits(input, this.getCurrentOptions());
      this.options = this.buildSearchResultsToDisplay(sortedHits);
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
  }

  protected getCurrentOptions(): Array<TOption | TGroup> {
    return this.getParentOption()?.options ?? this.settings.options;
  }

  protected getParentOption(index = -1): TGroup | undefined {
    const group = this.parentOptions.at(index);
    const option = group?.options.at(group.selectedCategoryIndex);
    if (option) {
      assertIsGroupOption<TGroup>(option);
    }
    return option;
  }

  private findSearchHits(
    searchInput: string,
    options: Array<TOption | TGroup>,
  ): Array<SortedOption<TOption, TGroup>> {
    return options
      .map((opt) => {
        if (isOptionGroup(opt)) {
          const sortedChildHits = this
            .findSearchHits(searchInput, opt.options)
            .sort(sortByDistance);

          if (sortedChildHits.length === 0) {
            return [];
          }

          return [{
            originalOption: opt,
            distance: Math.min(...sortedChildHits.map((item) => item.distance)),
            children: sortedChildHits,
          }];
        }

        if (this.matchOption(searchInput, opt)) {
          return [{
            originalOption: opt,
            distance: distance(opt.name, searchInput),
            children: [],
          }];
        }

        return [];
      })
      .flat()
      .sort(sortByDistance);

    function sortByDistance(
      a: SortedOption<TOption, TGroup>,
      b: SortedOption<TOption, TGroup>,
    ): number {
      return a.distance - b.distance;
    }
  }

  private buildSearchResultsToDisplay(
    sortedOptions: Array<SortedOption<TOption, TGroup>>,
  ): Array<TOption | TGroup> {
    return sortedOptions
      .map((option) => this.buildSearchResultHelper(0, option))
      .flat();
  }

  private buildSearchResultHelper(
    indentLevel: number,
    sortedItem: SortedOption<TOption, TGroup>,
  ): Array<TOption | TGroup> {
    sortedItem.originalOption.indentLevel = indentLevel;

    if (sortedItem.children.length > 0) {
      const sortedChildItems = sortedItem.children
        .map((nextLevelOption) =>
          this.buildSearchResultHelper(indentLevel + 1, nextLevelOption)
        )
        .flat();

      return [sortedItem.originalOption, ...sortedChildItems];
    } else {
      return [sortedItem.originalOption];
    }
  }

  private matchOption(
    inputString: string,
    option: TOption | TGroup,
  ): boolean {
    return this.matchInput(inputString, option.name) || (
      isOption(option) &&
      option.name !== option.value &&
      this.matchInput(inputString, option.value)
    );
  }

  private matchInput(inputString: string, value: string): boolean {
    return stripColor(value)
      .toLowerCase()
      .includes(inputString);
  }

  protected getBreadCrumb() {
    const parentsCount = this.parentOptions.length;
    const maxItems = this.settings.maxBreadcrumbItems;

    if (parentsCount === 0 || maxItems === 0) {
      return "";
    }
    const parentOptions = parentsCount > maxItems
      ? [this.parentOptions[0], ...this.parentOptions.slice(-maxItems + 1)]
      : this.parentOptions;

    const breadCrumb = parentOptions.map(({ options, selectedCategoryIndex }) =>
      options[selectedCategoryIndex].name
    );

    if (parentsCount > maxItems) {
      breadCrumb.splice(1, 0, "..");
    }

    return breadCrumb.join(` ${this.settings.breadcrumbSeparator} `);
  }

  protected async submit(): Promise<void> {
    const selectedOption = this.options[this.listIndex];

    if (this.isBackButton(selectedOption)) {
      this.submitBackButton();
    } else if (isOptionGroup(selectedOption)) {
      this.submitGroupOption(selectedOption);
    } else {
      await super.submit();
    }
  }

  protected submitBackButton() {
    const previousLevel = this.parentOptions.pop();
    if (!previousLevel) {
      return;
    }
    this.options = previousLevel.options;
    this.listIndex = previousLevel.selectedCategoryIndex;
    this.listOffset = 0;
  }

  protected submitGroupOption(selectedOption: TGroup) {
    this.parentOptions.push({
      options: this.options,
      selectedCategoryIndex: this.listIndex,
    });
    this.options = [
      this.#backButton,
      ...selectedOption.options,
    ];
    this.listIndex = 1;
    this.listOffset = 0;
  }

  protected isBackButton(option: TOption | TGroup): boolean {
    return option === this.#backButton;
  }

  protected hasParent(): boolean {
    return this.parentOptions.length > 0;
  }

  protected isSearching(): boolean {
    return this.getCurrentInputValue() !== "";
  }

  protected message(): string {
    let message = `${this.settings.indent}${this.settings.prefix}` +
      bold(this.settings.message) +
      this.defaults();
    if (this.settings.search) {
      message += " " + this.settings.searchLabel + " ";
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

    return "\n" + this.settings.indent + brightBlue(Figures.INFO) +
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
        this.settings.indent + dim("  No matches..."),
      );
    }
    return list.join("\n");
  }

  /**
   * Render option.
   * @param option        Option.
   * @param isSelected  Set to true if option is selected.
   */
  protected getListItem(
    option: TOption | TGroup,
    isSelected?: boolean,
  ): string {
    let line = this.getListItemIndent(option);
    line += this.getListItemPointer(option, isSelected);
    line += this.getListItemIcon(option);
    line += this.getListItemValue(option, isSelected);

    return line;
  }

  protected getListItemIndent(option: TOption | TGroup) {
    const indentLevel = this.isSearching()
      ? option.indentLevel
      : this.hasParent() && !this.isBackButton(option)
      ? 1
      : 0;

    return this.settings.indent + " ".repeat(indentLevel);
  }

  protected getListItemPointer(option: TOption | TGroup, isSelected?: boolean) {
    if (!isSelected) {
      return "  ";
    }

    if (this.isBackButton(option)) {
      return this.settings.backPointer + " ";
    } else if (isOptionGroup(option)) {
      return this.settings.groupPointer + " ";
    }

    return this.settings.listPointer + " ";
  }

  protected getListItemIcon(option: TOption | TGroup): string {
    if (this.isBackButton(option)) {
      return this.settings.groupOpenIcon + " ";
    } else if (isOptionGroup(option)) {
      return this.settings.groupIcon + " ";
    }

    return "";
  }

  protected getListItemValue(
    option: TOption | TGroup,
    isSelected?: boolean,
  ): string {
    let value = this.isBackButton(option) ? this.getBreadCrumb() : option.name;

    if (this.isBackButton(option)) {
      value = bold(
        isSelected && !option.disabled ? yellow(value) : dim(value),
      );
    } else {
      value = isSelected && !option.disabled
        ? this.highlight(value, (val) => val)
        : this.highlight(value);

      value = isOptionGroup(option) ? bold(value) : value;
    }

    return value;
  }

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
        ? this.options.findIndex((option: TOption | TGroup) =>
          !option.disabled
        ) || 0
        : this.options.findIndex((option: TOption | TGroup) =>
          isOption(option) && option.value === value
        ) ||
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
    const option = this.options.find((option) =>
      isOption(option) && option.value === value
    );

    return option && isOptionGroup(option) ? undefined : option;
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

export function isOption<
  TOption extends GenericListOption,
>(
  option: TOption | GenericListOptionGroup<GenericListOption>,
): option is TOption {
  return "value" in option;
}

export function isOptionGroup<
  TGroup extends GenericListOptionGroup<GenericListOption>,
>(
  option: TGroup | GenericListOption | string,
): option is TGroup {
  return typeof option === "object" && "options" in option &&
    option.options.length > 0;
}

export function assertIsOption<
  TOption extends GenericListOption,
>(
  option: TOption | GenericListOptionGroup<GenericListOption>,
): asserts option is TOption {
  if (!isOption(option)) {
    throw new Error("Expected an option but got an option group.");
  }
}

export function assertIsGroupOption<
  TGroup extends GenericListOptionGroup<GenericListOption>,
>(
  option: TGroup | GenericListOption,
): asserts option is TGroup {
  if (!isOptionGroup(option)) {
    throw new Error("Expected a group option but got an option.");
  }
}

/** @deprecated Use `Array<string | GenericListOption>` instead. */
export type GenericListValueOptions = Array<string | GenericListOption>;
/** @deprecated Use `Array<GenericListOptionSettings>` instead. */
export type GenericListValueSettings = Array<GenericListOptionSettings>;
