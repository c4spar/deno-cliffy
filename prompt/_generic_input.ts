import type { KeyEvent } from "../keycode/key_event.ts";
import {
  GenericPrompt,
  GenericPromptOptions,
  GenericPromptSettings,
} from "./_generic_prompt.ts";
import { stripColor, underline } from "./deps.ts";

/** Input keys options. */
export interface GenericInputKeys {
  moveCursorLeft?: string[];
  moveCursorRight?: string[];
  deleteCharLeft?: string[];
  deleteCharRight?: string[];
  submit?: string[];
}

/** Generic input prompt options. */
export interface GenericInputPromptOptions<T>
  extends GenericPromptOptions<T, string> {
  keys?: GenericInputKeys;
}

/** Generic input prompt settings. */
export interface GenericInputPromptSettings<T>
  extends GenericPromptSettings<T, string> {
  keys?: GenericInputKeys;
}

/** Generic input prompt representation. */
export abstract class GenericInput<T, S extends GenericInputPromptSettings<T>>
  extends GenericPrompt<T, string, S> {
  protected inputValue = "";
  protected inputIndex = 0;

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
        submit: ["enter", "return"],
        ...(settings.keys ?? {}),
      },
    });
  }

  protected message(): string {
    const message: string = super.message() + " " + this.settings.pointer + " ";
    this.cursor.x = stripColor(message).length + this.inputIndex + 1;
    return message + this.input();
  }

  protected input(): string {
    return underline(this.inputValue);
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
          Deno.kill(Deno.pid, Deno.Signal.SIGINT);
        }
        if (event.sequence) {
          this.addChar(event.sequence);
        }
        break;

      // case "up": // scroll history?
      //   break;
      //
      // case "down": // scroll history?
      //   break;

      case this.isKey(this.settings.keys, "moveCursorLeft", event):
        this.moveCursorLeft();
        break;

      case this.isKey(this.settings.keys, "moveCursorRight", event):
        this.moveCursorRight();
        break;

      case this.isKey(this.settings.keys, "deleteCharRight", event):
        this.deleteCharRight();
        break;

      case this.isKey(this.settings.keys, "deleteCharLeft", event):
        this.deleteChar();
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

  /**
   * Add character to current input.
   * @param char Char to add.
   */
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
      this.tty.cursorBackward(1);
      this.inputValue = this.inputValue.slice(0, this.inputIndex) +
        this.inputValue.slice(this.inputIndex + 1);
    }
  }

  /** Delete char right. */
  protected deleteCharRight(): void {
    if (this.inputIndex < this.inputValue.length) {
      this.inputValue = this.inputValue.slice(0, this.inputIndex) +
        this.inputValue.slice(this.inputIndex + 1);
    }
  }

  /** Get input input. */
  protected getValue(): string {
    return this.inputValue;
  }
}
