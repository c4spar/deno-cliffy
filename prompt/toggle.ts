import type { KeyCode } from "../keycode/key_code.ts";
import { dim, underline } from "./deps.ts";
import {
  GenericPrompt,
  GenericPromptKeys,
  GenericPromptOptions,
  GenericPromptSettings,
} from "./_generic_prompt.ts";

/** Generic prompt options. */
export interface ToggleOptions extends GenericPromptOptions<boolean, string> {
  active?: string;
  inactive?: string;
  keys?: ToggleKeys;
}

/** Toggle prompt settings. */
interface ToggleSettings extends GenericPromptSettings<boolean, string> {
  active: string;
  inactive: string;
  keys: ToggleKeys;
}

/** Toggle key options. */
export interface ToggleKeys extends GenericPromptKeys {
  active?: string[];
  inactive?: string[];
}

/** Toggle prompt representation. */
export class Toggle extends GenericPrompt<boolean, string> {
  protected readonly settings: ToggleSettings;
  protected status: string;

  /** Execute the prompt and show cursor on end. */
  public static prompt(
    options: string | ToggleOptions,
  ): Promise<boolean> {
    return new this(options).prompt();
  }

  constructor(options: string | ToggleOptions) {
    super();
    if (typeof options === "string") {
      options = { message: options };
    }
    this.settings = this.getDefaultSettings(options);
    this.status = typeof this.settings.default !== "undefined"
      ? this.format(this.settings.default)
      : "";
  }

  protected getDefaultSettings(options: ToggleOptions): ToggleSettings {
    const settings = super.getDefaultSettings(options);
    return {
      ...settings,
      active: options.active || "Yes",
      inactive: options.inactive || "No",
      keys: {
        active: ["right", "y", "j", "s", "o"],
        inactive: ["left", "n"],
        ...(settings.keys ?? {}),
      },
    };
  }

  protected message(): string {
    let message = super.message() + " " + this.settings.pointer + " ";

    if (this.status === this.settings.active) {
      message += dim(this.settings.inactive + " / ") +
        underline(this.settings.active);
    } else if (this.status === this.settings.inactive) {
      message += underline(this.settings.inactive) +
        dim(" / " + this.settings.active);
    } else {
      message += dim(this.settings.inactive + " / " + this.settings.active);
    }

    return message;
  }

  /** Read user input from stdin, handle events and validate user input. */
  protected read(): Promise<boolean> {
    this.tty.cursorHide();
    return super.read();
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyCode): Promise<void> {
    switch (true) {
      case event.sequence === this.settings.inactive[0].toLowerCase():
      case this.isKey(this.settings.keys, "inactive", event):
        this.selectInactive();
        break;
      case event.sequence === this.settings.active[0].toLowerCase():
      case this.isKey(this.settings.keys, "active", event):
        this.selectActive();
        break;
      default:
        await super.handleEvent(event);
    }
  }

  /** Set active. */
  protected selectActive() {
    this.status = this.settings.active;
  }

  /** Set inactive. */
  protected selectInactive() {
    this.status = this.settings.inactive;
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    return [this.settings.active, this.settings.inactive].indexOf(value) !== -1;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): boolean | undefined {
    switch (value) {
      case this.settings.active:
        return true;
      case this.settings.inactive:
        return false;
    }
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: boolean): string {
    return value ? this.settings.active : this.settings.inactive;
  }

  /** Get input value. */
  protected getValue(): string {
    return this.status;
  }
}
