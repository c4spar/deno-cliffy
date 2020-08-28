import { KeyEvent } from "../keycode/key-event.ts";
import { stripeColors } from "../table/utils.ts";
import {
  GenericPrompt,
  GenericPromptOptions,
  GenericPromptSettings,
} from "./_generic-prompt.ts";
import { underline } from "./deps.ts";

export interface GenericInputKeys {
  moveCursorLeft?: string[];
  moveCursorRight?: string[];
  deleteCharLeft?: string[];
  deleteCharRight?: string[];
  submit?: string[];
}

export interface GenericInputPromptOptions<T>
  extends GenericPromptOptions<T, string> {
  keys?: GenericInputKeys;
}

export interface GenericInputPromptSettings<T>
  extends GenericPromptSettings<T, string> {
  keys?: GenericInputKeys;
}

export abstract class GenericInput<T, S extends GenericInputPromptSettings<T>>
  extends GenericPrompt<T, string, S> {
  protected input = "";
  protected index = 0;

  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

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

  protected setPrompt(message: string) {
    message += " " + this.settings.pointer + " ";

    const length = new TextEncoder().encode(stripeColors(message)).length;

    message += underline(this.input);

    this.write(message);

    this.screen.cursorTo(length - 1 + this.index);
  }

  protected async handleEvent(event: KeyEvent): Promise<boolean> {
    switch (true) {
      case event.name === "c":
        if (event.ctrl) {
          this.screen.cursorShow();
          return Deno.exit(0);
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
        return true;

      default:
        if (event.sequence && !event.meta && !event.ctrl) {
          this.addChar(event.sequence);
        }
        break;
    }

    return false;
  }

  protected addChar(char: string): void {
    this.input = this.input.slice(0, this.index) + char +
      this.input.slice(this.index);
    this.index++;
  }

  protected moveCursorLeft(): void {
    if (this.index > 0) {
      this.index--;
    }
  }

  protected moveCursorRight(): void {
    if (this.index < this.input.length) {
      const index = this.input.indexOf(" ", this.index);
      this.index++;
    }
  }

  protected deleteChar(): void {
    if (this.index > 0) {
      this.index--;
      this.screen.cursorBackward(1);
      this.input = this.input.slice(0, this.index) +
        this.input.slice(this.index + 1);
    }
  }

  protected deleteCharRight(): void {
    if (this.index < this.input.length) {
      this.input = this.input.slice(0, this.index) +
        this.input.slice(this.index + 1);
    }
  }

  protected getValue(): string {
    return this.input;
  }
}
