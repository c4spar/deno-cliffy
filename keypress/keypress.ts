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
  public readonly key?: string;
  public readonly sequence?: string;
  public readonly code?: string;
  public readonly ctrlKey: boolean;
  public readonly metaKey: boolean;
  public readonly shiftKey: boolean;

  constructor(
    type: KeyPressEventType,
    eventInitDict: KeyPressEventInit,
  ) {
    super(type, eventInitDict);
    this.key = eventInitDict.name;
    this.sequence = eventInitDict.sequence;
    this.code = eventInitDict.code;
    this.ctrlKey = eventInitDict.ctrl ?? false;
    this.metaKey = eventInitDict.meta ?? false;
    this.shiftKey = eventInitDict.shift ?? false;
  }
}

type KeyPressEventType = "keydown" | "keyup";

export class KeyPress extends EventTarget
  implements AsyncIterableIterator<KeyPressEvent>, PromiseLike<KeyPressEvent> {
  #disposed = false;
  #pullQueue: PullQueueItem[] = [];
  #pushQueue: (KeyPressEvent | null)[] = [];
  #listeners: Record<KeyPressEventType, Set<any>> = {
    keydown: new Set(),
    keyup: new Set(),
  };

  [Symbol.asyncIterator](): AsyncIterableIterator<KeyPressEvent> {
    return this;
  }

  get disposed(): boolean {
    return this.#disposed;
  }

  async next(): Promise<IteratorResult<KeyPressEvent>> {
    const event: KeyPressEvent | null | false = !this.#disposed &&
      await this.#pullEvent();

    return event && !this.#disposed
      ? { done: false, value: event }
      : { done: true, value: undefined };
  }

  then<T, S>(
    f: (v: KeyPressEvent | null) => T | Promise<T>,
    g?: (v: Error) => S | Promise<S>,
  ): Promise<T | S> {
    return this.next()
      .then(({ value }) => {
        this.dispose();
        return value;
      })
      .then(f)
      .catch(g);
  }

  addEventListener(
    type: "keydown",
    listener: KeyPressEventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: "keyup",
    listener: KeyPressEventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: KeyPressEventType,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void {
    if (!this.#hasListeners()) {
      void this.#eventLoop();
    }
    super.addEventListener(type, listener, options);
    this.#listeners[type].add(listener);
  }

  removeEventListener(
    type: "keydown",
    callback: KeyPressEventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
  removeEventListener(
    type: KeyPressEventType,
    listener: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void {
    super.removeEventListener(type, listener, options);
    this.#listeners[type].delete(listener);
  }

  dispose() {
    if (this.#disposed) {
      throw new Error("KeyCodeStream already disposed");
    }
    this.#disposed = true;
    if (this.#pullQueue.length > 0) {
      const { resolve } = this.#pullQueue[0];
      this.#pullQueue.shift();
      resolve(null);
    }
  }

  #eventLoop = async (): Promise<void> => {
    if (this.#disposed) {
      return;
    }
    try {
      await this.#read();
      await new Promise((resolve) => setTimeout(resolve));
      if (this.#pullQueue.length || this.#hasListeners()) {
        await this.#eventLoop();
      } else {
        this.dispose();
      }
    } catch (error) {
      if (this.#pullQueue.length > 0) {
        const { reject } = this.#pullQueue.shift() as PullQueueItem;
        return reject(error);
      }
      throw error;
    }
    await this.#eventLoop();
  };

  #read = async (): Promise<void> => {
    const buffer = new Uint8Array(8);
    // Deno.setRaw(Deno.stdin.rid, true, { cbreak: true });
    Deno.setRaw(Deno.stdin.rid, true);
    const nread: number | null = await Deno.stdin.read(buffer).catch(
      (error) => {
        if (!this.#disposed) {
          throw error;
        }
        return null;
      },
    );
    if (Deno.stdin.rid) {
      Deno.setRaw(Deno.stdin.rid, false);
    }
    if (this.#disposed) {
      return;
    }

    let keys;
    if (nread === null) {
      keys = KeyCode.parse(buffer);
    } else {
      keys = KeyCode.parse(buffer.subarray(0, nread));
    }

    for (const key of keys) {
      const event = new KeyPressEvent("keydown", {
        ...key,
        cancelable: true,
        composed: true,
      });
      if (this.#pullQueue.length || !this.#hasListeners()) {
        this.#pushEvent(event);
      }
      if (this.#hasListeners()) {
        const canceled = !this.dispatchEvent(event);
        if (canceled || this.#disposed) {
          if (!this.#disposed) {
            this.dispose();
          }
          break;
        }
      }
    }
  };

  #pushEvent = (event: KeyPressEvent): void => {
    if (this.#pullQueue.length > 0) {
      const { resolve } = this.#pullQueue.shift() as PullQueueItem;
      resolve(event);
    } else {
      this.#pushQueue.push(event);
    }
  };

  #pullEvent = async (): Promise<KeyPressEvent | null> => {
    if (!this.#hasListeners()) {
      await this.#read();
    }
    return new Promise<KeyPressEvent | null>(
      (resolve: Resolver<KeyPressEvent | null>, reject: Reject) => {
        if (this.#pushQueue.length > 0) {
          const event: KeyPressEvent | null = this.#pushQueue.shift() ?? null;
          resolve(event);
        } else {
          this.#pullQueue.push({ resolve, reject });
        }
      },
    );
  };

  #hasListeners = (): boolean => {
    return Object.values(this.#listeners).some((listeners) => listeners.size);
  };
}

let keyPress: KeyPress;

export function keypress(): KeyPress {
  if (!keyPress || keyPress.disposed) {
    keyPress = new KeyPress();
  }
  return keyPress;
}
