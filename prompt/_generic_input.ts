import type { KeyCode } from "../keycode/key_code.ts";
import {
  GenericPrompt,
  GenericPromptKeys,
  GenericPromptOptions,
  GenericPromptSettings,
} from "./_generic_prompt.ts";
import { blue, dim, stripColor, underline } from "./deps.ts";

/** Input keys options. */
export interface GenericInputKeys extends GenericPromptKeys {
  moveCursorLeft?: string[];
  moveCursorRight?: string[];
  deleteCharLeft?: string[];
  deleteCharRight?: string[];
}

/** Generic input prompt options. */
export interface GenericInputPromptOptions<TValue, TRawValue>
  extends GenericPromptOptions<TValue, TRawValue> {
  keys?: GenericInputKeys;
}

/** Generic input prompt settings. */
export interface GenericInputPromptSettings<TValue, TRawValue>
  extends GenericPromptSettings<TValue, TRawValue> {
  keys?: GenericInputKeys;
}

/** Generic input prompt representation. */
export abstract class GenericInput<
  TValue,
  TRawValue,
  TSettings extends GenericInputPromptSettings<TValue, TRawValue>,
> extends GenericPrompt<TValue, TRawValue, TSettings> {
  protected inputValue = "";
  protected inputIndex = 0;

  /**
   * Prompt constructor.
   * @param settings Prompt settings.
   */
  protected constructor(settings: TSettings) {
    super({
      ...settings,
      keys: {
        moveCursorLeft: ["left"],
        moveCursorRight: ["right"],
        deleteCharLeft: ["backspace"],
        deleteCharRight: ["delete"],
        ...(settings.keys ?? {}),
      },
    });
  }

  protected getCurrentInputValue(): string {
    return this.inputValue;
  }

  protected message(): string {
    const message: string = super.message() + " " + this.settings.pointer + " ";
    this.cursor.x = stripColor(message).length + this.inputIndex + 1;
    return message + this.input();
  }

  protected input(): string {
    return underline(this.inputValue);
  }

  protected highlight(
    value: string | number,
    color1: (val: string) => string = dim,
    color2: (val: string) => string = blue,
  ): string {
    value = value.toString();
    const inputLowerCase = this.getCurrentInputValue().toLowerCase();
    const valueLowerCase = value.toLowerCase();
    const index = valueLowerCase.indexOf(inputLowerCase);
    const matched: string = value.slice(index, index + inputLowerCase.length);
    return index >= 0
      ? color1(value.slice(0, index)) + color2(matched) +
        color1(value.slice(index + inputLowerCase.length))
      : value;
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyCode): Promise<void> {
    switch (true) {
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
      case event.char && !event.meta && !event.ctrl:
        this.addChar(event.char!);
        break;
      default:
        await super.handleEvent(event);
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
}
