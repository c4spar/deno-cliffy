import { GenericPrompt } from "./_generic_prompt.ts";
import {
  GenericSuggestions,
  GenericSuggestionsKeys,
  GenericSuggestionsOptions,
} from "./_generic_suggestions.ts";
import { dim } from "./deps.ts";

type UnsupportedOptions =
  | "files"
  | "complete"
  | "suggestions"
  | "list"
  | "info";

/** Confirm prompt options. */
export type ConfirmOptions = Omit<ConfirmBaseOptions, UnsupportedOptions>;

/** Confirm prompt options. */
export interface ConfirmBaseOptions
  extends GenericSuggestionsOptions<boolean, string> {
  active?: string;
  inactive?: string;
  keys?: ConfirmKeys;
}

export type ConfirmKeys = GenericSuggestionsKeys;

/** Confirm prompt representation. */
export class Confirm
  extends GenericSuggestions<boolean, string, ConfirmBaseOptions> {
  private readonly active: string;
  private readonly inactive: string;

  /** Execute the prompt and show cursor on end. */
  public static prompt(
    options: string | ConfirmOptions,
  ): Promise<boolean> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this(options).prompt();
  }

  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Input value.
   */
  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

  constructor(options: ConfirmOptions) {
    super({
      ...options,
      files: false,
      complete: undefined,
      suggestions: [
        options.active ?? "Yes",
        options.inactive ?? "No",
      ],
      list: false,
      info: false,
    });
    this.active = this.settings.active || "Yes";
    this.inactive = this.settings.inactive || "No";
  }

  protected defaults(): string {
    let defaultMessage = "";

    if (this.settings.default === true) {
      defaultMessage += this.active[0].toUpperCase() + "/" +
        this.inactive[0].toLowerCase();
    } else if (this.settings.default === false) {
      defaultMessage += this.active[0].toLowerCase() + "/" +
        this.inactive[0].toUpperCase();
    } else {
      defaultMessage += this.active[0].toLowerCase() + "/" +
        this.inactive[0].toLowerCase();
    }

    return defaultMessage ? dim(` (${defaultMessage})`) : "";
  }

  protected success(value: boolean): string | undefined {
    this.saveSuggestions(this.format(value));
    return super.success(value);
  }

  /** Get input value. */
  protected getValue(): string {
    return this.inputValue;
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    return typeof value === "string" &&
      [
          this.active[0].toLowerCase(),
          this.active.toLowerCase(),
          this.inactive[0].toLowerCase(),
          this.inactive.toLowerCase(),
        ].indexOf(value.toLowerCase()) !== -1;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): boolean | undefined {
    switch (value.toLowerCase()) {
      case this.active[0].toLowerCase():
      case this.active.toLowerCase():
        return true;
      case this.inactive[0].toLowerCase():
      case this.inactive.toLowerCase():
        return false;
    }
    return;
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: boolean): string {
    return value ? this.active : this.inactive;
  }
}
