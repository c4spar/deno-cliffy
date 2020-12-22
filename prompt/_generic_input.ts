import type { KeyEvent } from "../keycode/key_event.ts";
import {
  GenericPrompt,
  GenericPromptOptions,
  GenericPromptSettings,
} from "./_generic_prompt.ts";
import { blue, bold, dim, stripColor, underline } from "./deps.ts";
import { Figures } from "./figures.ts";

/** Input keys options. */
export interface GenericInputKeys {
  moveCursorLeft?: string[];
  moveCursorRight?: string[];
  deleteCharLeft?: string[];
  deleteCharRight?: string[];
  complete?: string[];
  next?: string[];
  previous?: string[];
  submit?: string[];
}

/** Generic input prompt options. */
export interface GenericInputPromptOptions<T, V>
  extends GenericPromptOptions<T, V> {
  keys?: GenericInputKeys;
  suggestions?: Array<string | number>;
  list?: boolean;
  info?: boolean;
  indent?: string;
  listPointer?: string;
  maxRows?: number;
}

/** Generic input prompt settings. */
export interface GenericInputPromptSettings<T, V>
  extends GenericPromptSettings<T, V> {
  keys?: GenericInputKeys;
  suggestions?: Array<string | number>;
  list?: boolean;
  info?: boolean;
  indent: string;
  listPointer: string;
  maxRows: number;
}

/** Generic input prompt representation. */
export abstract class GenericInput<
  T,
  V,
  S extends GenericInputPromptSettings<T, V>,
> extends GenericPrompt<T, V, S> {
  protected inputValue = "";
  protected inputIndex = 0;
  protected suggestionsIndex = -1;
  protected suggestionsOffset = 0;
  protected suggestions: Array<string | number> = [];

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
        next: ["up"],
        previous: ["down"],
        submit: ["enter", "return"],
        ...(settings.keys ?? {}),
      },
    });
    if (this.settings.suggestions) {
      this.settings.suggestions = this.settings.suggestions.slice();
    }
  }

  protected render(): Promise<void> {
    this.match();
    return super.render();
  }

  protected getCurrentInputValue(): string {
    return this.inputValue;
  }

  protected match(): void {
    if (!this.settings.suggestions?.length) {
      return;
    }
    this.suggestions = this.settings.suggestions.filter(
      (value: string | number) =>
        value.toString().toLowerCase().startsWith(
          this.getCurrentInputValue().toLowerCase(),
        ),
    );
    this.suggestionsIndex = Math.max(
      this.getCurrentInputValue().trim().length === 0 ? -1 : 0,
      Math.min(this.suggestions.length - 1, this.suggestionsIndex),
    );
    this.suggestionsOffset = Math.max(
      0,
      Math.min(
        this.suggestions.length - this.getSuggestionsListHeight(),
        this.suggestionsOffset,
      ),
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

  protected getSuggestion(): string {
    return this.suggestions[this.suggestionsIndex]?.toString()
      .substr(
        this.getCurrentInputValue().length,
      ) ?? "";
  }

  protected body(): string | Promise<string> {
    return this.getSuggestionList() + this.getInfo();
  }

  protected getSuggestionList(): string {
    if (!this.settings.suggestions?.length || !this.settings.list) {
      return "";
    }
    const list: Array<string> = [];
    const height: number = this.getSuggestionsListHeight();
    for (
      let i = this.suggestionsOffset;
      i < this.suggestionsOffset + height;
      i++
    ) {
      list.push(
        this.getSuggestionListItem(
          this.suggestions[i],
          this.suggestionsIndex === i,
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
   * @param value        Option.
   * @param isSelected  Set to true if option is selected.
   */
  protected getSuggestionListItem(
    value: string | number,
    isSelected?: boolean,
  ): string {
    let line = this.settings.indent ?? "";
    line += isSelected ? `${this.settings.listPointer} ` : "  ";
    if (isSelected) {
      line += underline(this.highlight(value));
    } else {
      line += this.highlight(value);
    }
    return line;
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

  protected getInfo(): string {
    if (!this.settings.info) {
      return "";
    }
    const selected: number = this.suggestionsIndex + 1;
    const matched: number = this.suggestions.length;
    const actions: Array<[string, Array<string>]> = [];

    if (this.settings.suggestions?.length) {
      if (this.settings.list) {
        actions.push(
          ["Next", [Figures.ARROW_DOWN]],
          ["Previous", [Figures.ARROW_UP]],
          ["Next Page", [Figures.PAGE_DOWN]],
          ["Previous Page", [Figures.PAGE_UP]],
        );
      } else {
        actions.push(
          ["Next", [Figures.ARROW_UP]],
          ["Previous", [Figures.ARROW_DOWN]],
        );
      }
      actions.push(
        ["Complete", [Figures.TAB_RIGHT, dim(" or"), Figures.ARROW_RIGHT]],
      );
    }
    actions.push(
      ["Submit", [Figures.ENTER]],
    );

    let info = "";
    if (this.settings.list) {
      info += "\n";
    }
    info += this.settings.indent;
    if (this.settings.suggestions?.length) {
      info += (blue(Figures.INFO) + bold(` ${selected}/${matched} `));
    }
    info += actions
      .map((cur) => `${cur[0]}: ${bold(cur[1].join(" "))}`)
      .join(", ");

    return info;
  }

  /** Get suggestions row height. */
  protected getSuggestionsListHeight(
    suggestions: Array<string | number> = this.suggestions,
  ): number {
    return Math.min(
      suggestions.length,
      this.settings.maxRows || suggestions.length,
    );
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyEvent): Promise<void> {
    switch (true) {
      case event.name === "c" && event.ctrl:
        this.tty.cursorShow();
        Deno.exit(0);
        return;
      case this.isKey(this.settings.keys, "next", event):
        if (this.settings.list) {
          this.selectPreviousSuggestion();
        } else {
          this.selectNextSuggestion();
        }
        break;
      case this.isKey(this.settings.keys, "previous", event):
        if (this.settings.list) {
          this.selectNextSuggestion();
        } else {
          this.selectPreviousSuggestion();
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
      this.deleteCharRight();
    }
  }

  /** Delete char right. */
  protected deleteCharRight(): void {
    if (this.inputIndex < this.inputValue.length) {
      this.inputValue = this.inputValue.slice(0, this.inputIndex) +
        this.inputValue.slice(this.inputIndex + 1);
      if (!this.getCurrentInputValue().length) {
        this.suggestionsIndex = -1;
        this.suggestionsOffset = 0;
      }
    }
  }

  protected complete(): void {
    if (this.suggestions.length && this.suggestions[this.suggestionsIndex]) {
      this.inputValue = this.suggestions[this.suggestionsIndex].toString();
      this.inputIndex = this.inputValue.length;
      this.suggestionsIndex = 0;
      this.suggestionsOffset = 0;
    }
  }

  /** Select previous suggestion. */
  protected selectPreviousSuggestion(): void {
    if (this.suggestions?.length) {
      if (this.suggestionsIndex > -1) {
        this.suggestionsIndex--;
        if (this.suggestionsIndex < this.suggestionsOffset) {
          this.suggestionsOffset--;
        }
      }
    }
  }

  /** Select next suggestion. */
  protected selectNextSuggestion(): void {
    if (this.suggestions?.length) {
      if (this.suggestionsIndex < this.suggestions.length - 1) {
        this.suggestionsIndex++;
        if (
          this.suggestionsIndex >=
            this.suggestionsOffset + this.getSuggestionsListHeight()
        ) {
          this.suggestionsOffset++;
        }
      }
    }
  }
}
