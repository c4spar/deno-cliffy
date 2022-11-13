import type { KeyCode } from "../keycode/key_code.ts";
import { dim, underline } from "./deps.ts";
import {
  GenericPrompt,
  GenericPromptKeys,
  GenericPromptOptions,
} from "./_generic_prompt.ts";

/** Generic prompt options. */
export interface ToggleOptions extends GenericPromptOptions<boolean, string> {
  active?: string;
  inactive?: string;
  keys?: ToggleKeys;
}

/** Toggle key options. */
export interface ToggleKeys extends GenericPromptKeys {
  active?: string[];
  inactive?: string[];
}

/** Toggle prompt representation. */
export class Toggle extends GenericPrompt<boolean, string, ToggleOptions> {
  protected status: string = typeof this.settings.default !== "undefined"
    ? this.format(this.settings.default)
    : "";
  private readonly active: string;
  private readonly inactive: string;

  /** Execute the prompt and show cursor on end. */
  public static prompt(
    options: string | ToggleOptions,
  ): Promise<boolean> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this(options).prompt();
  }

  constructor(options: ToggleOptions) {
    super({
      ...options,
      keys: {
        active: ["right", "y", "j", "s", "o"],
        inactive: ["left", "n"],
        ...(options.keys ?? {}),
      },
    });
    this.active = this.settings.active || "Yes";
    this.inactive = this.settings.inactive || "No";
  }

  protected message(): string {
    let message = super.message() + this.pointer() + " ";

    if (this.status === this.active) {
      message += dim(this.inactive + " / ") +
        underline(this.active);
    } else if (this.status === this.inactive) {
      message += underline(this.inactive) +
        dim(" / " + this.active);
    } else {
      message += dim(this.inactive + " / " + this.active);
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
      case event.sequence === this.inactive[0].toLowerCase():
      case this.isKey(this.settings.keys, "inactive", event):
        this.selectInactive();
        break;
      case event.sequence === this.active[0].toLowerCase():
      case this.isKey(this.settings.keys, "active", event):
        this.selectActive();
        break;
      default:
        await super.handleEvent(event);
    }
  }

  /** Set active. */
  protected selectActive() {
    this.status = this.active;
  }

  /** Set inactive. */
  protected selectInactive() {
    this.status = this.inactive;
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    return [this.active, this.inactive].indexOf(value) !== -1;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): boolean | undefined {
    switch (value) {
      case this.active:
        return true;
      case this.inactive:
        return false;
    }
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: boolean): string {
    return value ? this.active : this.inactive;
  }

  /** Get input value. */
  protected getValue(): string {
    return this.status;
  }
}
