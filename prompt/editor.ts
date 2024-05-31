import { brightBlack, brightBlue } from "jsr:@std/fmt@0.224/colors";
import { GenericPrompt } from "./_generic_prompt.ts";
import {
  GenericSuggestions,
  GenericSuggestionsKeys,
  GenericSuggestionsOptions,
  GenericSuggestionsSettings,
} from "./_generic_suggestions.ts";
import { normalize } from "@std/path";

/** Editor prompt options. */
export interface EditorOptions
  extends GenericSuggestionsOptions<string, string> {
  /** Prompt end delimiter. */
  endDelimiter?: string;
  /** Set minimum allowed length of editor value. */
  minLength?: number;
  /** Set maximum allowed length of editor value. */
  maxLength?: number;
}

/** Editor prompt settings. */
interface EditorSettings extends GenericSuggestionsSettings<string, string> {
  minLength: number;
  maxLength: number;
  endDelimiter: string;
}

/**
 * Editor prompt representation.
 *
 * ```ts
 * import { Editor } from "./mod.ts";
 *
 * const confirmed: string = await Editor.prompt("Enter your name");
 * ```
 */
export class Editor extends GenericSuggestions<string, string> {
  protected readonly settings: EditorSettings;

  /** Execute the prompt with provided options. */
  public static prompt(options: string | EditorOptions): Promise<string> {
    return new this(options).prompt();
  }

  /**
   * Inject prompt value. If called, the prompt doesn't prompt for an input and
   * returns immediately the injected value. Can be used for unit tests or pre
   * selections.
   *
   * @param value Input value.
   */
  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

  constructor(options: string | EditorOptions) {
    super();
    if (typeof options === "string") {
      options = { message: options };
    }
    this.settings = this.getDefaultSettings(options);
  }

  public getDefaultSettings(options: EditorOptions): EditorSettings {
    return {
      ...super.getDefaultSettings(options),
      pointer: options.pointer ??
        `${brightBlack("EOF: (")}${brightBlue(options.endDelimiter ?? ".")}${
          brightBlack(")")
        }`,
      endDelimiter: options.endDelimiter ?? ".",
      minLength: options.minLength ?? 0,
      maxLength: options.maxLength ?? Infinity,
    };
  }

  get #osShell(): string {
    return Deno.build.os === "windows" ? "pwsh" : "bash";
  }

  get #osShellArgs(): string[] {
    return Deno.build.os === "windows" ? ["-nop", "-c"] : ["-c"];
  }

  async #getDefaultEditor(): Promise<string> {
    //? Maybe refactor these lines to an helper function
    const queryEditor = Deno.build.os === "windows"
      //pwsh
      // try $EDITOR then $VISUAL global vars, else git user defined editor, else vim, else vscode, else notepad
      ? '"$($EDITOR ?? $VISUAL ?? $($(git config core.editor) 2> $null) ?? $($(vim -h) 2>&1> $null && echo "vim") ?? $($(code -h) 2>&1> $null && echo "code") ?? $(echo "notepad"))"'
      //sh
      // try $EDITOR then $VISUAL global vars, else git user defined editor, else os terminal defined editor is available, else vi
      : '"${EDITOR:-${VISUAL:-$(git config core.editor 2> /dev/null || (sensible-editor --version &> /dev/null && echo "sensible-editor") || echo "vi")}}"';

    const { stdout, stderr, success } = await new Deno.Command(this.#osShell, {
      args: [...this.#osShellArgs, `echo ${queryEditor}`],
    }).output();

    const decoder = new TextDecoder();

    if (success) {
      return decoder.decode(stdout).trim();
    } else {
      throw new Error("unable to determine user default terminal editor", {
        cause: new Error(decoder.decode(stderr).trim()),
      });
    }
  }

  public async prompt() {
    //TODO fix stdin error
    GenericPrompt.inject("\n");
    //Show default prompt
    await super.prompt();

    const tmpFilePath = await Deno.makeTempFile();

    const editor = await this.#getDefaultEditor();

    //open editor
    const { success } = await new Deno.Command(this.#osShell, {
      args: [...this.#osShellArgs, `${editor} ${tmpFilePath}`],
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit",
    }).output();

    if (!success) {
      throw new Error(
        `unable to open detected user defined editor (${editor})`,
      );
    }

    const content = await Deno.readTextFile(tmpFilePath);
    await Deno.remove(tmpFilePath);

    return content;
  }

  protected success(value: string): string | undefined {
    //TODO
    this.saveSuggestions(value);
    return super.success(value);
  }

  /** Get editor value. */
  protected getValue(): string {
    //TODO
    return this.settings.files ? normalize(this.inputValue) : this.inputValue;
  }

  /**
   * Validate editor value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    if (typeof value !== "string") {
      return false;
    }
    if (value.length < this.settings.minLength) {
      return `Value must be longer than ${this.settings.minLength} but has a length of ${value.length}.`;
    }
    if (value.length > this.settings.maxLength) {
      return `Value can't be longer than ${this.settings.maxLength} but has a length of ${value.length}.`;
    }
    return true;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): string | undefined {
    //TODO
    return value.trim();
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: string): string {
    return value;
  }
}
