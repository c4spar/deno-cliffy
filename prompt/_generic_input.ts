import type { KeyEvent } from "../keycode/key_event.ts";
import {
  GenericPrompt,
  GenericPromptOptions,
  GenericPromptSettings,
} from "./_generic_prompt.ts";
import { dim, stripColor, underline } from "./deps.ts";

/** Input keys options. */
export interface GenericInputKeys {
  moveCursorLeft?: string[];
  moveCursorRight?: string[];
  deleteCharLeft?: string[];
  deleteCharRight?: string[];
  complete?: string[];
  selectNextHistory?: string[];
  selectPreviousHistory?: string[];
  submit?: string[];
}

/** Generic input prompt options. */
export interface GenericInputPromptOptions<T>
  extends GenericPromptOptions<T, string> {
  keys?: GenericInputKeys;
  suggestions?: Array<string | number>;
}

/** Generic input prompt settings. */
export interface GenericInputPromptSettings<T>
  extends GenericPromptSettings<T, string> {
  keys?: GenericInputKeys;
  suggestions?: Array<string | number>;
}

/** Generic input prompt representation. */
export abstract class GenericInput<T, S extends GenericInputPromptSettings<T>>
  extends GenericPrompt<T, string, S> {
  protected inputValue = "";
  protected inputIndex = 0;
  protected suggestionsIndex = 0;
  protected suggestions: Array<string | number> = [];

  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Input value.
   */
  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

  /**
   * Prompt constructor.
   * @param settings Prompt settings.
   */
  protected constructor(settings: S) {
    super({
      ...settings,
      keys: {
        moveCursorLeft: ["left"],
        moveCursorRight: ["right"],
        deleteCharLeft: ["backspace"],
        deleteCharRight: ["delete"],
        complete: ["tab"],
        selectNextHistory: ["up"],
        selectPreviousHistory: ["down"],
        submit: ["enter", "return"],
        ...(settings.keys ?? {}),
      },
      suggestions: settings.suggestions?.slice(),
    });
    this.settings.suggestions?.unshift(
      this.settings.default ? this.format(this.settings.default) : "",
    );
  }

  protected message(): string {
    const message: string = super.message() + " " + this.settings.pointer + " ";
    this.cursor.x = stripColor(message).length + this.inputIndex + 1;
    return message + this.input();
  }

  protected input(): string {
    return underline(this.inputValue) + dim(this.getSuggestion());
  }

  protected render(): Promise<void> {
    this.match();
    return super.render();
  }

  protected getSuggestion(needle: string = this.inputValue): string {
    return this.suggestions[this.suggestionsIndex]?.toString()
      .substr(
        needle.length,
      ) ?? "";
  }

  protected match(needle: string = this.inputValue): void {
    if (!this.settings.suggestions?.length) {
      return;
    }
    this.suggestions = this.settings.suggestions
      .filter((value: string | number) =>
        value.toString().toLowerCase().startsWith(needle.toLowerCase())
      );
    this.suggestionsIndex = Math.min(
      this.suggestions.length - 1,
      Math.max(0, this.suggestionsIndex),
    );
  }

  /** Get user input. */
  protected getValue(): string {
    return this.inputValue;
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyEvent): Promise<void> {
    switch (true) {
      case event.name === "c":
        if (event.ctrl) {
          this.tty.cursorShow();
          return Deno.exit(0);
        }
        if (event.sequence) {
          this.addChar(event.sequence);
        }
        break;

      case this.isKey(this.settings.keys, "moveCursorLeft", event):
        this.moveCursorLeft();
        break;

      case this.isKey(this.settings.keys, "moveCursorRight", event):
        if (this.inputIndex < this.inputValue.length) {
          this.moveCursorRight();
        } else {
          this.complete();
        }
        break;

      case this.isKey(this.settings.keys, "deleteCharRight", event):
        this.deleteCharRight();
        break;

      case this.isKey(this.settings.keys, "deleteCharLeft", event):
        this.deleteChar();
        break;

      case this.isKey(this.settings.keys, "selectNextHistory", event):
        this.selectNextSuggestion();
        break;

      case this.isKey(this.settings.keys, "selectPreviousHistory", event):
        this.selectPreviousSuggestion();
        break;

      case this.isKey(this.settings.keys, "complete", event):
        this.complete();
        break;

      case this.isKey(this.settings.keys, "submit", event):
        await this.submit();
        break;

      default:
        if (event.sequence && !event.meta && !event.ctrl) {
          this.addChar(event.sequence);
        }
    }
  }

  /** Add character to current input. */
  protected addChar(char: string): void {
    this.inputValue = this.inputValue.slice(0, this.inputIndex) + char +
      this.inputValue.slice(this.inputIndex);
    this.inputIndex++;
  }

  /** Move prompt cursor left. */
  protected moveCursorLeft(): void {
    if (this.inputIndex > 0) {
      this.inputIndex--;
    }
  }

  /** Move prompt cursor right. */
  protected moveCursorRight(): void {
    if (this.inputIndex < this.inputValue.length) {
      this.inputIndex++;
    }
  }

  /** Delete char left. */
  protected deleteChar(): void {
    if (this.inputIndex > 0) {
      this.inputIndex--;
      this.tty.cursorBackward();
      this.deleteCharRight();
    }
  }

  /** Delete char right. */
  protected deleteCharRight(): void {
    if (this.inputIndex < this.inputValue.length) {
      this.inputValue = this.inputValue.slice(0, this.inputIndex) +
        this.inputValue.slice(this.inputIndex + 1);
    }
  }

  protected complete(): void {
    if (this.suggestions.length) {
      this.inputValue += this.getSuggestion();
      this.inputIndex = this.inputValue.length;
      this.suggestionsIndex = 0;
    }
  }

  /** Select previous suggestion. */
  protected selectPreviousSuggestion(): void {
    if (this.settings.suggestions?.length) {
      if (this.suggestionsIndex > 0) {
        this.suggestionsIndex--;
      }
    }
  }

  /** Select next suggestion. */
  protected selectNextSuggestion(): void {
    if (this.settings.suggestions?.length) {
      if (this.suggestionsIndex < this.suggestions.length - 1) {
        this.suggestionsIndex++;
      }
    }
  }
}
