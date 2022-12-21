// deno-lint-ignore-file no-explicit-any ban-types

import { tty } from "../ansi/tty.ts";
import {
  GenericPrompt,
  GenericPromptOptions,
  StaticGenericPrompt,
} from "./_generic_prompt.ts";

type Next<TName extends keyof any> = (
  next?: TName | number | true | null,
) => Promise<void>;

type PromptOptions<
  TName extends string,
  TStaticPrompt extends StaticGenericPrompt<any, any, any> | void,
  TResult,
  TOptions = TStaticPrompt extends StaticGenericPrompt<any, any, any>
    ? Parameters<TStaticPrompt["prompt"]>[0]
    : never,
> = TStaticPrompt extends StaticGenericPrompt<any, any, any> ? 
    & {
      name: TName;
      type: TStaticPrompt;
      before?: (
        opts: TResult,
        next: Next<Exclude<keyof TResult, symbol>>,
      ) => void | Promise<void>;
      after?: (
        opts: TResult,
        next: Next<Exclude<keyof TResult, symbol>>,
      ) => void | Promise<void>;
    }
    // exclude none options parameter
    & (TOptions extends GenericPromptOptions<any, any> ? TOptions : {})
  : never;

type PromptResult<
  N extends string,
  G extends StaticGenericPrompt<any, any, any> | void,
> = G extends StaticGenericPrompt<any, any, any> ? {
    [K in N]?: Awaited<ReturnType<G["prompt"]>>;
  }
  : {};

interface PromptListOptions<R, N extends keyof R = keyof R> {
  cbreak?: boolean;
  before?: (
    name: N,
    opts: R,
    next: Next<Exclude<N, symbol>>,
  ) => void | Promise<void>;
  after?: (
    name: N,
    opts: R,
    next: Next<Exclude<N, symbol>>,
  ) => void | Promise<void>;
}

/** Global prompt options. */
export interface GlobalPromptOptions<R, N extends keyof R = keyof R>
  extends PromptListOptions<R, N> {
  initial?: N extends symbol ? never : N;
}

type Id<T> = T extends Record<string, unknown>
  ? T extends infer U ? { [K in keyof U]: Id<U[K]> } : never
  : T;

export function prompt<
  TName0 extends string,
  TName1 extends string,
  TName2 extends string,
  TName3 extends string,
  TName4 extends string,
  TName5 extends string,
  TName6 extends string,
  TName7 extends string,
  TName8 extends string,
  TName9 extends string,
  TName10 extends string,
  TName11 extends string,
  TName12 extends string,
  TName13 extends string,
  TName14 extends string,
  TName15 extends string,
  TName16 extends string,
  TName17 extends string,
  TName18 extends string,
  TName19 extends string,
  TName20 extends string,
  TName21 extends string,
  TName22 extends string,
  TName23 extends string,
  TOptions0 extends GenericPromptOptions<any, any>,
  TOptions1 extends GenericPromptOptions<any, any>,
  TOptions2 extends GenericPromptOptions<any, any>,
  TOptions3 extends GenericPromptOptions<any, any>,
  TOptions4 extends GenericPromptOptions<any, any>,
  TOptions5 extends GenericPromptOptions<any, any>,
  TOptions6 extends GenericPromptOptions<any, any>,
  TOptions7 extends GenericPromptOptions<any, any>,
  TOptions8 extends GenericPromptOptions<any, any>,
  TOptions9 extends GenericPromptOptions<any, any>,
  TOptions10 extends GenericPromptOptions<any, any>,
  TOptions11 extends GenericPromptOptions<any, any>,
  TOptions12 extends GenericPromptOptions<any, any>,
  TOptions13 extends GenericPromptOptions<any, any>,
  TOptions14 extends GenericPromptOptions<any, any>,
  TOptions15 extends GenericPromptOptions<any, any>,
  TOptions16 extends GenericPromptOptions<any, any>,
  TOptions17 extends GenericPromptOptions<any, any>,
  TOptions18 extends GenericPromptOptions<any, any>,
  TOptions19 extends GenericPromptOptions<any, any>,
  TOptions20 extends GenericPromptOptions<any, any>,
  TOptions21 extends GenericPromptOptions<any, any>,
  TOptions22 extends GenericPromptOptions<any, any>,
  TOptions23 extends GenericPromptOptions<any, any>,
  TStaticPrompt0 extends StaticGenericPrompt<any, any, TOptions0>,
  TStaticPrompt1 extends
    | StaticGenericPrompt<any, any, TOptions1>
    | void = void,
  TStaticPrompt2 extends
    | StaticGenericPrompt<any, any, TOptions2>
    | void = void,
  TStaticPrompt3 extends
    | StaticGenericPrompt<any, any, TOptions3>
    | void = void,
  TStaticPrompt4 extends
    | StaticGenericPrompt<any, any, TOptions4>
    | void = void,
  TStaticPrompt5 extends
    | StaticGenericPrompt<any, any, TOptions5>
    | void = void,
  TStaticPrompt6 extends
    | StaticGenericPrompt<any, any, TOptions6>
    | void = void,
  TStaticPrompt7 extends
    | StaticGenericPrompt<any, any, TOptions7>
    | void = void,
  TStaticPrompt8 extends
    | StaticGenericPrompt<any, any, TOptions8>
    | void = void,
  TStaticPrompt9 extends
    | StaticGenericPrompt<any, any, TOptions9>
    | void = void,
  TStaticPrompt10 extends
    | StaticGenericPrompt<any, any, TOptions10>
    | void = void,
  TStaticPrompt11 extends
    | StaticGenericPrompt<any, any, TOptions11>
    | void = void,
  TStaticPrompt12 extends
    | StaticGenericPrompt<any, any, TOptions12>
    | void = void,
  TStaticPrompt13 extends
    | StaticGenericPrompt<any, any, TOptions13>
    | void = void,
  TStaticPrompt14 extends
    | StaticGenericPrompt<any, any, TOptions14>
    | void = void,
  TStaticPrompt15 extends
    | StaticGenericPrompt<any, any, TOptions15>
    | void = void,
  TStaticPrompt16 extends
    | StaticGenericPrompt<any, any, TOptions16>
    | void = void,
  TStaticPrompt17 extends
    | StaticGenericPrompt<any, any, TOptions17>
    | void = void,
  TStaticPrompt18 extends
    | StaticGenericPrompt<any, any, TOptions18>
    | void = void,
  TStaticPrompt19 extends
    | StaticGenericPrompt<any, any, TOptions19>
    | void = void,
  TStaticPrompt20 extends
    | StaticGenericPrompt<any, any, TOptions20>
    | void = void,
  TStaticPrompt21 extends
    | StaticGenericPrompt<any, any, TOptions21>
    | void = void,
  TStaticPrompt22 extends
    | StaticGenericPrompt<any, any, TOptions22>
    | void = void,
  TStaticPrompt23 extends
    | StaticGenericPrompt<any, any, TOptions23>
    | void = void,
  TResult = Id<
    & PromptResult<TName0, TStaticPrompt0>
    & PromptResult<TName1, TStaticPrompt1>
    & PromptResult<TName2, TStaticPrompt2>
    & PromptResult<TName3, TStaticPrompt3>
    & PromptResult<TName4, TStaticPrompt4>
    & PromptResult<TName5, TStaticPrompt5>
    & PromptResult<TName6, TStaticPrompt6>
    & PromptResult<TName7, TStaticPrompt7>
    & PromptResult<TName8, TStaticPrompt8>
    & PromptResult<TName9, TStaticPrompt9>
    & PromptResult<TName10, TStaticPrompt10>
    & PromptResult<TName11, TStaticPrompt11>
    & PromptResult<TName12, TStaticPrompt12>
    & PromptResult<TName13, TStaticPrompt13>
    & PromptResult<TName14, TStaticPrompt14>
    & PromptResult<TName15, TStaticPrompt15>
    & PromptResult<TName16, TStaticPrompt16>
    & PromptResult<TName17, TStaticPrompt17>
    & PromptResult<TName18, TStaticPrompt18>
    & PromptResult<TName19, TStaticPrompt19>
    & PromptResult<TName20, TStaticPrompt20>
    & PromptResult<TName21, TStaticPrompt21>
    & PromptResult<TName22, TStaticPrompt22>
    & PromptResult<TName23, TStaticPrompt23>
  >,
>(prompts: [
  PromptOptions<TName0, TStaticPrompt0, TResult>,
  PromptOptions<TName1, TStaticPrompt1, TResult>?,
  PromptOptions<TName2, TStaticPrompt2, TResult>?,
  PromptOptions<TName3, TStaticPrompt3, TResult>?,
  PromptOptions<TName4, TStaticPrompt4, TResult>?,
  PromptOptions<TName5, TStaticPrompt5, TResult>?,
  PromptOptions<TName6, TStaticPrompt6, TResult>?,
  PromptOptions<TName7, TStaticPrompt7, TResult>?,
  PromptOptions<TName8, TStaticPrompt8, TResult>?,
  PromptOptions<TName9, TStaticPrompt9, TResult>?,
  PromptOptions<TName10, TStaticPrompt10, TResult>?,
  PromptOptions<TName11, TStaticPrompt11, TResult>?,
  PromptOptions<TName12, TStaticPrompt12, TResult>?,
  PromptOptions<TName13, TStaticPrompt13, TResult>?,
  PromptOptions<TName14, TStaticPrompt14, TResult>?,
  PromptOptions<TName15, TStaticPrompt15, TResult>?,
  PromptOptions<TName16, TStaticPrompt16, TResult>?,
  PromptOptions<TName17, TStaticPrompt17, TResult>?,
  PromptOptions<TName18, TStaticPrompt18, TResult>?,
  PromptOptions<TName19, TStaticPrompt19, TResult>?,
  PromptOptions<TName20, TStaticPrompt20, TResult>?,
  PromptOptions<TName21, TStaticPrompt21, TResult>?,
  PromptOptions<TName22, TStaticPrompt22, TResult>?,
  PromptOptions<TName23, TStaticPrompt23, TResult>?,
], options?: GlobalPromptOptions<TResult>): Promise<TResult> {
  return new PromptList(
    prompts as PromptOptions<any, any, any, any>,
    options as PromptListOptions<any>,
  ).run(options?.initial) as Promise<TResult>;
}

let injected: Record<string, any> = {};

/**
 * Inject prompt values. Can be used for unit tests or pre selections.
 * @param values Input values object.
 */
export function inject(values: Record<string, any>): void {
  injected = values;
}

class PromptList {
  private result: Record<string, any> = {};
  private index = -1;
  private names: Array<string>;
  private isInBeforeHook = false;

  private get prompt(): PromptOptions<string, any, any> {
    return this.prompts[this.index];
  }

  public constructor(
    private prompts: Array<PromptOptions<string, any, any>>,
    private options?: PromptListOptions<any>,
  ) {
    this.names = this.prompts.map((prompt) => prompt.name);
  }

  public async run(
    name?: string | number | true,
  ): Promise<Record<string, any>> {
    this.index = -1;
    this.result = {};
    this.isInBeforeHook = false;
    await this.next(name);
    return this.result;
  }

  private async next(name?: string | number | true | null): Promise<void> {
    if (this.updateIndex(name)) {
      await this.runBeforeHook(async () => {
        this.isInBeforeHook = false;
        await this.runPrompt();
        await this.runAfterHook();
      });
    }
  }

  private updateIndex(name?: string | number | true | null): boolean {
    if (name && typeof name === "string") {
      this.index = this.names.indexOf(name);
      if (this.index === -1) {
        throw new Error(
          `Invalid prompt name: ${name}, allowed prompt names: ${
            this.names.join(", ")
          }`,
        );
      }
    } else if (typeof name === "number") {
      if (name < 0 || name > this.names.length) {
        throw new Error(
          `Invalid prompt index: ${name}, prompt length: ${this.names.length}`,
        );
      }
      this.index = name;
    } else if (name === true && !this.isInBeforeHook) {
      this.index++;
      if (this.index < this.names.length - 1) {
        this.index++;
      }
    } else {
      this.index++;
    }

    this.isInBeforeHook = false;

    if (this.index < this.names.length) {
      return true;
    } else if (this.index === this.names.length) {
      return false;
    } else {
      throw new Error("next() called multiple times");
    }
  }

  private async runBeforeHook(run: () => Promise<void>): Promise<void> {
    this.isInBeforeHook = true;

    const next = async (name?: string | number | true | null) => {
      if (name || typeof name === "number") {
        return this.next(name as (string | number | true));
      }
      await run();
    };

    if (this.options?.before) {
      await this.options.before(
        this.prompt.name,
        this.result,
        async (name?: string | number | true | null) => {
          if (name || typeof name === "number") {
            return this.next(name as (string | number | true));
          } else if (this.prompt.before) {
            await this.prompt.before(this.result, next);
          } else {
            await run();
          }
        },
      );

      return;
    } else if (this.prompt.before) {
      await this.prompt.before(this.result, next);

      return;
    }

    await run();
  }

  private async runPrompt(): Promise<void> {
    const prompt: StaticGenericPrompt<any, any, any> = this.prompt.type;

    if (typeof injected[this.prompt.name] !== "undefined") {
      if (prompt.inject) {
        prompt.inject(injected[this.prompt.name]);
      } else {
        GenericPrompt.inject(injected[this.prompt.name]);
      }
    }

    try {
      this.result[this.prompt.name] = await prompt.prompt({
        cbreak: this.options?.cbreak,
        ...this.prompt,
      });
    } finally {
      tty.cursorShow();
    }
  }

  private async runAfterHook(): Promise<void> {
    if (this.options?.after) {
      await this.options.after(this.prompt.name, this.result, async (name) => {
        if (name) {
          return this.next(name as string);
        } else if (this.prompt.after) {
          await this.prompt.after(this.result, (name) => this.next(name));
        } else {
          await this.next();
        }
      });
    } else if (this.prompt.after) {
      await this.prompt.after(this.result, (name) => this.next(name));
    } else {
      await this.next();
    }
  }
}
