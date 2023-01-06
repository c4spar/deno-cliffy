import { bold, brightBlue, dim, underline, yellow } from "./deps.ts";
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
import { distance } from "../_utils/distance.ts";

/** Select prompt options. */
export interface SelectOptions extends GenericListOptions<string, string> {
  options: Array<string | SelectOption>;
  maxBreadcrumbItems?: number;
  breadcrumbSeparator?: string;
  keys?: SelectKeys;
}

/** Select prompt settings. */
export interface SelectSettings extends GenericListSettings<string, string> {
  options: Array<SelectOptionSettings>;
  maxBreadcrumbItems: number;
  breadcrumbSeparator: string;
  backPointer: string;
  categoryPointer: string;
  categoryMarker: string;
  keys?: SelectKeys;
}

/** Select option options. */
export interface SelectOption extends GenericListOption {
  options?: Array<string | SelectOption>;
}

/** Select option settings. */
export interface SelectOptionSettings extends GenericListOptionSettings {
  options: Array<SelectOptionSettings>;
  indentLevel: number;
}

/** Select key options. */
export type SelectKeys = GenericListKeys;

interface ParentOptions {
  options: Array<SelectOptionSettings>;
  selectedCategoryIndex: number;
}

interface SortedOption {
  originalOption: SelectOptionSettings;
  distance: number;
  children: SortedOption[];
}

const backItem: SelectOptionSettings = {
  name: "Back",
  value: "back-1f8dec5d-a00c-4c9f-afb2-ca0c17f04a94",
  options: [],
  disabled: false,
  indentLevel: 0,
};

/** Select prompt representation. */
export class Select extends GenericList<string, string> {
  protected readonly settings: SelectSettings;
  protected options: Array<SelectOptionSettings>;
  protected listIndex: number;
  protected listOffset: number;
  #parentCategories: Array<ParentOptions> = [];
  /**
   * Since categories add a "Back" item to the list of options,
   * they should not use zero as the first selected item.
   */
  #indexOfFirstItemInsideCategory = 1;

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
    super();
    this.settings = this.getDefaultSettings(options);
    this.options = this.settings.options.slice();
    this.listIndex = this.getListIndex(this.settings.default);
    this.listOffset = this.getPageOffset(this.listIndex);
  }

  protected getDefaultSettings(options: SelectOptions): SelectSettings {
    return {
      backPointer: brightBlue(Figures.LEFT_POINTER),
      categoryPointer: brightBlue(Figures.POINTER),
      categoryMarker: dim(Figures.FOLDER),
      maxBreadcrumbItems: 5,
      breadcrumbSeparator: " › ",
      ...super.getDefaultSettings(options),
      options: this.mapOptions(options, options.options).map(
        (option) => this.mapOption(options, option),
      ),
    };
  }

  protected mapOption(
    options: SelectOptions,
    option: SelectOption,
  ): SelectOptionSettings {
    return {
      indentLevel: 0,
      ...super.mapOption(options, option),
      options: option.options
        ? this.mapOptions(options, option.options) as Array<
          SelectOptionSettings
        >
        : [],
    };
  }

  protected input(): string {
    return underline(brightBlue(this.inputValue));
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
    let itemName = item.name;

    if (this.isCurrentlySearching()) {
      line += this.settings.indent.repeat(item.indentLevel);
      line += isSelected ? `${this.settings.listPointer} ` : "  ";
    } else {
      let pointer = "";
      if (Select.itemIsBackButton(item)) {
        pointer = this.settings.backPointer;
        itemName = yellow(itemName);
      } else if (Select.itemIsCategory(item)) {
        pointer = this.settings.categoryPointer;
        itemName = this.settings.categoryMarker + bold(itemName);
      } else {
        pointer = this.settings.listPointer;
      }

      line += isSelected ? `${pointer} ` : "  ";
    }

    line += `${
      isSelected && !item.disabled
        ? this.highlight(itemName, (val) => val)
        : this.highlight(itemName)
    }`;

    return line;
  }

  /** Get value of selected option. */
  protected getValue(): string {
    return this.options[this.listIndex]?.value ?? this.settings.default;
  }

  protected async submit(): Promise<void> {
    const itemToSubmit = this.options[this.listIndex];

    if (Select.itemIsBackButton(itemToSubmit)) {
      const previousLevel = this.#parentCategories.pop();
      if (typeof previousLevel === "object") {
        this.options = previousLevel.options;
        if (this.isCurrentlyInsideCategory()) {
          this.listIndex = this.#indexOfFirstItemInsideCategory;
        } else {
          this.listIndex = 0;
        }
      }
      this.listOffset = 0;
    } else if (Select.itemIsCategory(itemToSubmit)) {
      this.#parentCategories.push({
        options: this.options,
        selectedCategoryIndex: this.listIndex,
      });
      this.options = this.itemsInsideCategory(itemToSubmit);
      this.listIndex = this.#indexOfFirstItemInsideCategory;
      this.listOffset = 0;
    } else {
      await super.submit();
    }
  }

  private itemsInsideCategory(
    option: SelectOptionSettings,
  ): Array<SelectOptionSettings> {
    return [
      backItem,
      ...this.mapOptions(this.settings, option.options) as Array<
        SelectOptionSettings
      >,
    ];
  }

  protected body(): string | Promise<string> {
    let categoryText = "";
    const numberOfParents = this.#parentCategories.length;
    const maxItems = this.settings.maxBreadcrumbItems;

    if (numberOfParents === 0 || maxItems === 0) {
      return super.body();
    } else if (numberOfParents <= maxItems) {
      categoryText = this.settings.breadcrumbSeparator +
        this.#parentCategories.map((_category, index) =>
          Select.nameOfParentCategoryForIndex(index, this.#parentCategories)
        ).join(this.settings.breadcrumbSeparator);
    } else {
      const lastCategories = this.#parentCategories.slice(-maxItems);
      categoryText = this.settings.breadcrumbSeparator + ".." +
        this.settings.breadcrumbSeparator +
        lastCategories.map((_category, index) =>
          Select.nameOfParentCategoryForIndex(index, lastCategories)
        ).join(this.settings.breadcrumbSeparator);
    }

    return dim(bold(categoryText)) + "\n" + super.body();
  }

  private static nameOfParentCategoryForIndex(
    index: number,
    parentOptions: ParentOptions[],
  ): string {
    const { options, selectedCategoryIndex } = parentOptions[index];
    return options[selectedCategoryIndex].name;
  }

  protected match(): void {
    const input: string = this.getCurrentInputValue().toLowerCase();

    if (input === "") {
      if (this.isCurrentlyInsideCategory()) {
        const nearestParentCategories =
          this.#parentCategories[this.#parentCategories.length - 1];
        const categoryToRevertTo = nearestParentCategories
          .options[nearestParentCategories.selectedCategoryIndex];

        this.options = this.itemsInsideCategory(categoryToRevertTo);
        this.listIndex = this.#indexOfFirstItemInsideCategory;
      } else {
        this.options = this.settings.options.slice();
        this.clampListIndex();
      }
    } else {
      const sortedHits = this.findSearchHits(input, this.itemsToSearchIn());
      this.options = this.buildSearchResultsToDisplay(sortedHits);
      this.listIndex = this.options.findIndex((option) => !option.disabled);
    }

    this.clampListOffset();
  }

  private findSearchHits(
    searchInput: string,
    options: SelectValueSettings,
  ): SortedOption[] {
    return options.map((opt) => {
      if (Select.itemIsCategory(opt)) {
        const sortedChildHits = this.findSearchHits(searchInput, opt.options)
          .sort(this.sortByDistance);

        if (sortedChildHits.length === 0) {
          return [];
        } else {
          return [{
            originalOption: opt,
            distance: Math.min(...sortedChildHits.map((item) => item.distance)),
            children: sortedChildHits,
          }];
        }
      } else if (GenericList.matchesItem(searchInput, opt)) {
        return [{
          originalOption: opt,
          distance: distance(opt.name, searchInput),
          children: [],
        }];
      } else {
        return [];
      }
    }).flat().sort(this.sortByDistance);
  }

  private sortByDistance(a: SortedOption, b: SortedOption): number {
    return a.distance - b.distance;
  }

  private itemsToSearchIn(): SelectValueSettings {
    return this.isCurrentlyInsideCategory()
      ? this.#parentCategories[this.#parentCategories.length - 1]
        .options[
          this.#parentCategories[this.#parentCategories.length - 1]
            .selectedCategoryIndex
        ].options
      : this.settings.options;
  }

  private buildSearchResultsToDisplay(
    sortedOptions: SortedOption[],
  ): SelectValueSettings {
    return sortedOptions.map((option) =>
      this.buildSearchResultHelper(0, option)
    )
      .flat();
  }

  private buildSearchResultHelper(
    indentLevel: number,
    sortedItem: SortedOption,
  ): SelectValueSettings {
    if (sortedItem.children.length > 0) {
      const sortedChildItems = sortedItem.children.map((nextLevelOption) =>
        this.buildSearchResultHelper(indentLevel + 1, nextLevelOption)
      )
        .flat();

      const itemForCategoryInSearchResult: SelectOptionSettings = {
        name: dim(sortedItem.originalOption.name),
        value: sortedItem.originalOption.value,
        disabled: true,
        options: [],
        indentLevel: indentLevel,
      };

      return [itemForCategoryInSearchResult, ...sortedChildItems];
    } else {
      sortedItem.originalOption.indentLevel = indentLevel;
      return [sortedItem.originalOption];
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

  private static itemIsCategory(item: SelectOptionSettings): boolean {
    return item.options.length > 0;
  }

  private static itemIsBackButton(item: SelectOptionSettings): boolean {
    return item.value === backItem.value;
  }

  private isCurrentlyInsideCategory(): boolean {
    return this.#parentCategories.length > 0;
  }

  private isCurrentlySearching(): boolean {
    return this.getCurrentInputValue() !== "";
  }
}

/**
 * Select options type.
 * @deprecated Use `Array<string | SelectOption>` instead.
 */
export type SelectValueOptions = Array<string | SelectOption>;

/**
 * Select option settings type.
 * @deprecated Use `Array<SelectOptionSettings>` instead.
 */
export type SelectValueSettings = Array<SelectOptionSettings>;
