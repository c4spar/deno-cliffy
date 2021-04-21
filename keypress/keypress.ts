import { KeyCode } from "../keycode/key_code.ts";

type Resolver<T> = (value: T | PromiseLike<T>) => void;
type Reject = (error: Error) => void;

interface PullQueueItem {
  resolve: Resolver<KeyPressEvent | null>;
  reject: Reject;
}

interface KeyCodeOptions {
  name?: string;
  sequence?: string;
  code?: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
}

export type KeyPressEventListener = (
  evt: KeyPressEvent,
) => void | Promise<void>;

interface KeyPressEventListenerObject {
  handleEvent(evt: KeyPressEvent): void | Promise<void>;
}

export type KeyPressEventInit = EventInit & KeyCodeOptions;

type KeyPressEventListenerOrEventListenerObject =
  | KeyPressEventListener
  | KeyPressEventListenerObject;

export class KeyPressEvent extends Event {
  public readonly name?: string;
  public readonly sequence?: string;
  public readonly code?: string;
  public readonly ctrl: boolean;
  public readonly meta: boolean;
  public readonly shift: boolean;

  constructor(eventInitDict: KeyPressEventInit) {
    super("keypress", eventInitDict);
    this.name = eventInitDict.name;
    this.sequence = eventInitDict.sequence;
    this.code = eventInitDict.code;
    this.ctrl = eventInitDict.ctrl ?? false;
    this.meta = eventInitDict.meta ?? false;
    this.shift = eventInitDict.shift ?? false;
  }
}

export class KeyPress extends EventTarget
  implements AsyncIterableIterator<KeyPressEvent>, PromiseLike<KeyPressEvent> {
  #listening: boolean = false;
  #disposed = false;
  #pullQueue: PullQueueItem[] = [];
  #pushQueue: (KeyPressEvent | null)[] = [];

  [Symbol.asyncIterator](): AsyncIterableIterator<KeyPressEvent> {
    return this;
  }

  async next(): Promise<IteratorResult<KeyPressEvent>> {
    const event: KeyPressEvent | null | false = !this.#disposed &&
      await this.#pullEvent();
    if (!event) {
      this.#listening = false;
      return { done: true, value: undefined };
    }
    return { done: false, value: event };
  }

  then<T, S>(
    f: (v: KeyPressEvent | null) => T | Promise<T>,
    g?: (v: Error) => S | Promise<S>,
  ): Promise<T | S> {
    return this.next()
      .then(({ value }) => value)
      .then(f)
      .catch(g);
  }

  addEventListener(
    type: "keypress",
    listener: KeyPressEventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: "keypress",
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.#listen();
    super.addEventListener(type, listener, options);
  }

  removeEventListener(
    type: "keypress",
    callback: KeyPressEventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
  removeEventListener(
    type: "keypress",
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void {
    super.removeEventListener(type, callback, options);
  }

  dispose() {
    if (this.#disposed) {
      throw new Error("KeyCodeStream already disposed");
    }
    this.#disposed = true;
    Deno.stdin.close();
    if (this.#pullQueue.length > 0) {
      const { resolve } = this.#pullQueue[0];
      this.#pullQueue.shift();
      resolve(null);
    }
  }

  #pushEvent = (event: KeyPressEvent): void => {
    if (this.#pullQueue.length > 0) {
      const { resolve } = this.#pullQueue.shift() as PullQueueItem;
      resolve(event);
    } else {
      this.#pushQueue.push(event);
    }
  };

  #pullEvent = (): Promise<KeyPressEvent | null> => {
    return new Promise<KeyPressEvent | null>(
      (resolve: Resolver<KeyPressEvent | null>, reject: Reject) => {
        if (this.#pushQueue.length > 0) {
          const event: KeyPressEvent | null = this.#pushQueue[0];
          this.#pushQueue.shift();
          resolve(event);
        } else {
          this.#pullQueue.push({ resolve, reject });
          this.#read().catch(reject);
        }
      },
    );
  };

  #read = async (): Promise<void> => {
    const buffer = new Uint8Array(8);
    // Deno.setRaw(Deno.stdin.rid, true, { cbreak: true });
    Deno.setRaw(Deno.stdin.rid, true);
    const nread: number | null = await Deno.stdin.read(buffer);
    Deno.setRaw(Deno.stdin.rid, false);
    let keys;
    if (nread === null) {
      keys = KeyCode.parse(buffer);
    } else {
      keys = KeyCode.parse(buffer.subarray(0, nread));
    }
    for (const key of keys) {
      this.#pushEvent(
        new KeyPressEvent({
          ...key,
          cancelable: true,
          composed: true,
        }),
      );
    }
  };

  #listen = async (): Promise<void> => {
    if (this.#listening) {
      return;
    }
    this.#listening = true;
    for await (const event of this) {
      const canceled = !this.dispatchEvent(event);
      if (canceled) {
        break;
      }
    }
  };
}

export function keypress(): KeyPress {
  return new KeyPress();
}
