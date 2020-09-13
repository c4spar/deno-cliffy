import type { KeyEvent } from "../keycode/key-event.ts";
import { blue, dim, underline } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericPrompt,
  GenericPromptOptions,
  GenericPromptSettings,
} from "./_generic-prompt.ts";

export interface ToggleKeys {
  active?: string[];
  inactive?: string[];
  submit?: string[];
}

type ToggleKeysSettings = Required<ToggleKeys>;

export interface ToggleOptions extends GenericPromptOptions<boolean, string> {
  active?: string;
  inactive?: string;
  keys?: ToggleKeys;
}

interface ToggleSettings extends GenericPromptSettings<boolean, string> {
  active: string;
  inactive: string;
  keys: ToggleKeysSettings;
}

export class Toggle extends GenericPrompt<boolean, string, ToggleSettings> {
  protected status: string = typeof this.settings.default !== "undefined"
    ? this.format(this.settings.default)
    : "";

  public static async prompt(
    options: string | ToggleOptions,
  ): Promise<boolean> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      active: "Yes",
      inactive: "No",
      ...options,
      keys: {
        active: ["right", "y", "j", "s", "o"],
        inactive: ["left", "n"],
        submit: ["enter", "return"],
        ...(options.keys ?? {}),
      },
    }).prompt();
  }

  protected setPrompt(message: string) {
    message += ` ${this.settings.pointer} `;

    if (this.status === this.settings.active) {
      message += `${dim(`${this.settings.inactive} /`)} ${
        underline(this.settings.active)
      }`;
    } else if (this.status === this.settings.inactive) {
      message += `${underline(this.settings.inactive)} ${
        dim(`/ ${this.settings.active}`)
      }`;
    } else {
      message += dim(`${this.settings.inactive} / ${this.settings.active}`);
    }

    this.write(message);
  }

  protected async read(): Promise<boolean> {
    this.screen.cursorHide();

    return super.read();
  }

  protected async handleEvent(event: KeyEvent): Promise<boolean> {
    switch (true) {
      case event.name === "c":
        if (event.ctrl) {
          this.screen.cursorShow();
          return Deno.exit(0);
        }
        break;

      case event.sequence === this.settings.inactive[0].toLowerCase():
      case this.isKey(this.settings.keys, "inactive", event):
        this.selectInactive();
        break;

      case event.sequence === this.settings.active[0].toLowerCase():
      case this.isKey(this.settings.keys, "active", event):
        this.selectActive();
        break;

      case this.isKey(this.settings.keys, "submit", event):
        return true;
    }

    return false;
  }

  protected selectActive() {
    this.status = this.settings.active;
  }

  protected selectInactive() {
    this.status = this.settings.inactive;
  }

  protected validate(value: string): boolean | string {
    return [this.settings.active, this.settings.inactive].indexOf(value) !== -1;
  }

  protected transform(value: string): boolean | undefined {
    switch (value) {
      case this.settings.active:
        return true;
      case this.settings.inactive:
        return false;
    }
  }

  protected format(value: boolean): string {
    return value ? this.settings.active : this.settings.inactive;
  }

  protected getValue(): string {
    return this.status;
  }
}
