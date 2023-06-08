import type { KeyCode } from "../keycode/mod.ts";
import { brightBlue, dim, green, red } from "./deps.ts";
import { Figures, getFiguresByKeys } from "./_figures.ts";
import {
  GenericList,
  GenericListKeys,
  GenericListOption,
  GenericListOptionGroup,
  GenericListOptionGroupSettings,
  GenericListOptions,
  GenericListOptionSettings,
  GenericListSettings,
  isOption,
  isOptionGroup,
} from "./_generic_list.ts";
import { GenericPrompt } from "./_generic_prompt.ts";

/** Checkbox prompt options. */
export interface CheckboxOptions
  extends GenericListOptions<Array<string>, Array<string>> {
  /** Keymap to assign key names to prompt actions. */
  keys?: CheckboxKeys;
  /** An array of child options. */
  options: Array<string | CheckboxOption | CheckboxOptionGroup>;
  /** If enabled, the user needs to press enter twice. Default is `true`. */
  confirmSubmit?: boolean;
  /** Change check icon. Default is `green(Figures.TICK)`. */
  check?: string;
  /** Change uncheck icon. Default is `red(Figures.CROSS)`. */
  uncheck?: string;
  /** Change partial check icon. Default is `green(Figures.RADIO_ON)`. */
  partialCheck?: string;
  /** The minimum allowed options to select. Default is `0`. */
  minOptions?: number;
  /** The maximum allowed options to select. Default is `Infinity`. */
  maxOptions?: number;
}

/** Checkbox prompt settings. */
interface CheckboxSettings extends
  GenericListSettings<
    Array<string>,
    Array<string>,
    CheckboxOptionSettings,
    CheckboxOptionGroupSettings
  > {
  confirmSubmit: boolean;
  check: string;
  uncheck: string;
  partialCheck: string;
  minOptions: number;
  maxOptions: number;
  keys: CheckboxKeys;
}

/** Checkbox option options. */
export interface CheckboxOption extends GenericListOption {
  /** Set checked status. */
  checked?: boolean;
  /** Change option icon. */
  icon?: boolean;
}

/** Checkbox option group options. */
export interface CheckboxOptionGroup
  extends GenericListOptionGroup<CheckboxOption> {
  /** Change option icon. */
  icon?: boolean;
}

/** Checkbox option settings. */
export interface CheckboxOptionSettings extends GenericListOptionSettings {
  checked: boolean;
  icon: boolean;
}

/** Checkbox option group settings. */
export interface CheckboxOptionGroupSettings
  extends GenericListOptionGroupSettings<CheckboxOptionSettings> {
  readonly checked: boolean;
  icon: boolean;
}

/** Checkbox prompt keymap. */
export interface CheckboxKeys extends GenericListKeys {
  /** Check/uncheck option keymap. Default is `["space"]`. */
  check?: Array<string>;
}

/**
 * Checkbox prompt representation.
 *
 * ```ts
 * import { Checkbox } from "./mod.ts";
 *
 * const colors: Array<string> = await Checkbox.prompt({
 *   message: "Pick some colors",
 *   options: ["red", "green", "blue"],
 * });
 * ```
 *
 * You can also group options:
 *
 * ```ts
 * import { Checkbox } from "./mod.ts";
 *
 * const values = await Checkbox.prompt({
 *   message: "Select some values",
 *   options: [{
 *     name: "Group 1",
 *     options: ["foo", "bar", "baz"],
 *   }, {
 *     name: "Group 2",
 *     options: ["beep", "boop"],
 *   }],
 * });
 * ```
 */
export class Checkbox extends GenericList<
  Array<string>,
  Array<string>,
  CheckboxOptionSettings,
  CheckboxOptionGroupSettings
> {
  protected readonly settings: CheckboxSettings;
  protected options: Array<
    CheckboxOptionSettings | CheckboxOptionGroupSettings
  >;
  protected listIndex: number;
  protected listOffset: number;
  private confirmSubmit = false;

  /**
   * Execute the prompt with provided options.
   *
   * @param options Checkbox options.
   */
  public static prompt(options: CheckboxOptions): Promise<Array<string>> {
    return new this(options).prompt();
  }

  /**
   * Create list separator.
   *
   * @param label Separator label.
   */
  public static separator(label?: string): CheckboxOption {
    return {
      ...super.separator(label),
      icon: false,
    };
  }

  /**
   * Inject prompt value. If called, the prompt doesn't prompt for an input and
   * returns immediately the injected value. Can be used for unit tests or pre
   * selections.
   *
   * @param value Input value.
   */
  public static inject(value: Array<string>): void {
    GenericPrompt.inject(value);
  }

  constructor(options: CheckboxOptions) {
    super();
    this.settings = this.getDefaultSettings(options);
    this.options = this.settings.options.slice();
    this.listIndex = this.getListIndex();
    this.listOffset = this.getPageOffset(this.listIndex);
  }

  protected getDefaultSettings(options: CheckboxOptions): CheckboxSettings {
    const settings = super.getDefaultSettings(options);
    return {
      confirmSubmit: true,
      ...settings,
      check: options.check ?? green(Figures.TICK),
      uncheck: options.uncheck ?? red(Figures.CROSS),
      partialCheck: options.partialCheck ?? green(Figures.RADIO_ON),
      minOptions: options.minOptions ?? 0,
      maxOptions: options.maxOptions ?? Infinity,
      options: this.mapOptions(options, options.options),
      keys: {
        check: ["space"],
        ...(settings.keys ?? {}),
        open: options.keys?.open ?? ["right"],
        back: options.keys?.back ?? ["left", "escape"],
      },
    };
  }

  /**
   * Map string option values to options and set option defaults.
   *
   * @param promptOptions Checkbox options.
   */
  protected mapOptions(
    promptOptions: CheckboxOptions,
    options: Array<string | CheckboxOption | CheckboxOptionGroup>,
  ): Array<CheckboxOptionSettings | CheckboxOptionGroupSettings> {
    return options.map((option) =>
      isOptionGroup(option)
        ? this.mapOptionGroup(promptOptions, option)
        : typeof option === "string"
        ? this.mapOption(promptOptions, { value: option })
        : this.mapOption(promptOptions, option)
    );
  }

  protected mapOption(
    options: CheckboxOptions,
    option: CheckboxOption,
  ): CheckboxOptionSettings {
    return {
      ...super.mapOption(options, option),
      checked: typeof option.checked === "undefined" && options.default &&
          options.default.indexOf(option.value) !== -1
        ? true
        : !!option.checked,
      icon: typeof option.icon === "undefined" ? true : option.icon,
    };
  }

  protected mapOptionGroup(
    promptOptions: CheckboxOptions,
    option: CheckboxOptionGroup,
  ): CheckboxOptionGroupSettings {
    const options = this.mapOptions(promptOptions, option.options);
    return {
      ...super.mapOptionGroup(promptOptions, option, false),
      get checked() {
        return areAllChecked(options);
      },
      options,
      icon: typeof option.icon === "undefined" ? true : option.icon,
    };
  }

  protected match(): void {
    super.match();
    if (this.isSearching()) {
      this.selectSearch();
    }
  }

  protected getListItemIcon(
    option: CheckboxOptionSettings | CheckboxOptionGroupSettings,
  ): string {
    return this.getCheckboxIcon(option) + super.getListItemIcon(option);
  }

  private getCheckboxIcon(
    option: CheckboxOptionSettings | CheckboxOptionGroupSettings,
  ): string {
    if (!option.icon) {
      return "";
    }
    const icon = option.checked
      ? this.settings.check + " "
      : isOptionGroup(option) && areSomeChecked(option.options)
      ? this.settings.partialCheck + " "
      : this.settings.uncheck + " ";

    return option.disabled ? dim(icon) : icon;
  }

  /** Get value of checked options. */
  protected getValue(): Array<string> {
    return flatOptions<CheckboxOptionSettings, CheckboxOptionGroupSettings>(
      this.settings.options,
    )
      .filter((option) => option.checked)
      .map((option) => option.value);
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyCode): Promise<void> {
    const hasConfirmed: boolean = this.confirmSubmit;
    this.confirmSubmit = false;

    switch (true) {
      case this.isKey(this.settings.keys, "check", event) &&
        !this.isSearchSelected():
        this.checkValue();
        break;
      case this.isKey(this.settings.keys, "submit", event):
        await this.submit(hasConfirmed);
        break;
      default:
        await super.handleEvent(event);
    }
  }

  protected hint(): string | undefined {
    if (this.confirmSubmit) {
      const info = this.selectedOption && this.isBackButton(this.selectedOption)
        ? ` To leave the group use ${
          getFiguresByKeys(this.settings.keys.back ?? []).join(", ")
        }.`
        : ` To open the selected group ${
          getFiguresByKeys(this.settings.keys.open ?? []).join(", ")
        }.`;

      return this.settings.indent +
        brightBlue(
          `Press ${
            getFiguresByKeys(this.settings.keys.submit ?? [])
          } again to submit.${info}`,
        );
    }

    return super.hint();
  }

  protected async submit(hasConfirmed?: boolean): Promise<void> {
    if (
      !hasConfirmed &&
      this.settings.confirmSubmit &&
      Deno.isatty(Deno.stdout.rid) &&
      !this.isSearchSelected()
    ) {
      this.confirmSubmit = true;
      return;
    }

    await super.submit();
  }

  /** Check selected option. */
  protected checkValue(): void {
    const option = this.options.at(this.listIndex);
    if (!option) {
      this.setErrorMessage("No option available to select.");
      return;
    } else if (option.disabled) {
      this.setErrorMessage("This option is disabled and cannot be changed.");
      return;
    }
    this.checkOption(option, !option.checked);
  }

  private checkOption(
    option: CheckboxOptionSettings | CheckboxOptionGroupSettings,
    checked: boolean,
  ) {
    if (isOption(option)) {
      option.checked = checked;
    } else {
      for (const childOption of option.options) {
        this.checkOption(childOption, checked);
      }
    }
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: Array<string>): boolean | string {
    const options = flatOptions<
      CheckboxOptionSettings,
      CheckboxOptionGroupSettings
    >(this.settings.options);
    const isValidValue = Array.isArray(value) &&
      value.every((val) =>
        typeof val === "string" &&
        val.length > 0 &&
        options.findIndex((option: CheckboxOptionSettings) =>
            option.value === val
          ) !== -1
      );

    if (!isValidValue) {
      return false;
    }

    if (value.length < this.settings.minOptions) {
      return `The minimum number of options is ${this.settings.minOptions} but got ${value.length}.`;
    }
    if (value.length > this.settings.maxOptions) {
      return `The maximum number of options is ${this.settings.maxOptions} but got ${value.length}.`;
    }

    return true;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: Array<string>): Array<string> {
    return value.map((val) => val.trim());
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: Array<string>): string {
    return value.map((val) => this.getOptionByValue(val)?.name ?? val)
      .join(", ");
  }
}

function areSomeChecked(
  options: Array<CheckboxOptionSettings | CheckboxOptionGroupSettings>,
): boolean {
  return options.some((option) =>
    isOptionGroup(option) ? areSomeChecked(option.options) : option.checked
  );
}

function areAllChecked(
  options: Array<CheckboxOptionSettings | CheckboxOptionGroupSettings>,
): boolean {
  return options.every((option) =>
    isOptionGroup(option) ? areAllChecked(option.options) : option.checked
  );
}

function flatOptions<
  TOption extends GenericListOptionSettings,
  TGroup extends GenericListOptionGroupSettings<TOption>,
>(
  options: Array<TOption | TGroup>,
): Array<TOption> {
  return flat(options);

  function flat(
    options: Array<TOption | TGroup>,
    indentLevel = 0,
    opts: Array<TOption> = [],
  ): Array<TOption> {
    for (const option of options) {
      option.indentLevel = indentLevel;
      if (isOption(option)) {
        opts.push(option);
      }
      if (isOptionGroup(option)) {
        flat(option.options, ++indentLevel, opts);
      }
    }

    return opts;
  }
}
/**
 * Checkbox options type.
 * @deprecated Use `Array<string | CheckboxOption>` instead.
 */
export type CheckboxValueOptions = Array<string | CheckboxOption>;

/**
 * Checkbox option settings type.
 * @deprecated Use `Array<CheckboxOptionSettings | CheckboxOptionGroupSettings>` instead.
 */
export type CheckboxValueSettings = Array<
  CheckboxOptionSettings | CheckboxOptionGroupSettings
>;
