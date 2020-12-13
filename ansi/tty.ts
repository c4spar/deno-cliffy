import * as ansiEscapes from "./ansi_escapes.ts";
import { Chain } from "./chain.ts";

/** Cursor position. */
export interface Cursor {
  x: number;
  y: number;
}

/** Create new `Ansi` instance. */
export interface TtyOptions {
  stdout?: Deno.WriterSync;
  stdin?: Deno.ReaderSync & { rid: number };
}

type Executor = (this: TtyChain, ...args: Args) => string;
type Args = Array<unknown>;
type Property = string | Executor;
type PropertyNames = keyof Chain<TtyChain>;

/** Ansi instance returned by all ansi escape properties. */
export interface TtyChain extends Exclude<Chain<TtyChain>, "cursorPosition"> {
  /** Write ansi escape sequence. */
  (): void;
  /** Get current cursor position. */
  getCursorPosition(): Cursor;
}

/** Create new `Tty` instance. */
export type TtyFactory = (options?: TtyOptions) => Tty;

/**
 * Chainable ansi escape sequence's.
 * If invoked as method, a new Tty instance will be returned.
 */
export type Tty = TtyFactory & TtyChain;

/**
 * Chainable ansi escape sequence's.
 * If invoked as method, a new Tty instance will be returned.
 * ```
 * tty.cursorTo(0, 0).eraseScreen();
 * ```
 */
export const tty: Tty = factory();

function factory(options?: TtyOptions): Tty {
  let result = "";
  let stack: Array<[Property, Args]> = [];
  const stdout: Deno.WriterSync = options?.stdout ?? Deno.stdout;
  const stdin: Deno.ReaderSync & { rid: number } = options?.stdin ?? Deno.stdin;

  const tty: Tty = function (
    this: TtyChain | undefined,
    ...args: Args | [TtyOptions]
  ): TtyChain {
    if (this) {
      update(args);
      stdout.writeSync(new TextEncoder().encode(result));
      return this;
    }
    return factory(args[0] as TtyOptions ?? options);
  } as Tty;

  tty.getCursorPosition = function (): Cursor {
    const data = new Uint8Array(8);

    Deno.setRaw(stdin.rid, true);
    stdout.writeSync(new TextEncoder().encode(ansiEscapes.cursorPosition));
    stdin.readSync(data);
    Deno.setRaw(stdin.rid, false);

    const [y, x] = new TextDecoder()
      .decode(data)
      .match(/\[(\d+);(\d+)R/)
      ?.slice(1, 3)
      .map(Number) ?? [0, 0];

    return { x, y };
  };

  const methodList: Array<[PropertyNames, Property]> = Object.entries(
    ansiEscapes,
  ) as Array<[PropertyNames, Property]>;

  for (const [name, method] of methodList) {
    if (name === "cursorPosition") {
      continue;
    }
    Object.defineProperty(tty, name, {
      get(this: TtyChain) {
        stack.push([method, []]);
        return this;
      },
    });
  }

  return tty;

  function update(args?: Args) {
    if (!stack.length) {
      return;
    }
    if (args) {
      stack[stack.length - 1][1] = args;
    }
    result = stack.reduce(
      (prev: string, [cur, args]: [Property, Args]) =>
        prev + (typeof cur === "string" ? cur : cur.call(tty, ...args)),
      "",
    );
    stack = [];
  }
}
