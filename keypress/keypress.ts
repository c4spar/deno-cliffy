import { KeyCode } from "../keycode/key_code.ts";
import { KeyEvent } from "../keycode/key_event.ts";

type KeyboardEventType = "keydown";

interface KeyCodeOptions {
  name?: string;
  sequence?: string;
  code?: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export type KeyboardEventListener = (
  evt: KeyboardEvent,
) => void | Promise<void>;

interface KeyboardEventListenerObject {
  handleEvent(evt: KeyboardEvent): void | Promise<void>;
}

export type KeyboardEventInit = EventInit & KeyCodeOptions;

type KeyboardEventListenerOrEventListenerObject =
  | KeyboardEventListener
  | KeyboardEventListenerObject;

export class KeyboardEvent extends Event {
  public readonly key?: string;
  public readonly sequence?: string;
  public readonly code?: string;
  public readonly ctrlKey: boolean;
  public readonly metaKey: boolean;
  public readonly shiftKey: boolean;
  public readonly altKey: boolean;

  constructor(
    type: KeyboardEventType,
    eventInitDict: KeyboardEventInit,
  ) {
    super(type, eventInitDict);
    this.key = eventInitDict.name;
    this.sequence = eventInitDict.sequence;
    this.code = eventInitDict.code;
    this.ctrlKey = eventInitDict.ctrl ?? false;
    this.metaKey = eventInitDict.meta ?? false;
    this.shiftKey = eventInitDict.shift ?? false;
    this.altKey = eventInitDict.alt ?? false;
  }
}

type Resolver<T> = (value: T | PromiseLike<T>) => void;
type Reject = (error: Error) => void;

interface PullQueueItem {
  resolve: Resolver<KeyboardEvent | null>;
  reject: Reject;
}

export class Keypress extends EventTarget
  implements AsyncIterableIterator<KeyboardEvent>, PromiseLike<KeyboardEvent> {
  #disposed = false;
  #pullQueue: PullQueueItem[] = [];
  #pushQueue: (KeyboardEvent | null)[] = [];
  #listeners: Record<
    KeyboardEventType,
    Set<EventListenerOrEventListenerObject | null>
  > = {
    keydown: new Set(),
  };

  [Symbol.asyncIterator](): AsyncIterableIterator<KeyboardEvent> {
    return this;
  }

  get disposed(): boolean {
    return this.#disposed;
  }

  async next(): Promise<IteratorResult<KeyboardEvent>> {
    const event: KeyboardEvent | null | false = !this.#disposed &&
      await this.#pullEvent();

    return event && !this.#disposed
      ? { done: false, value: event }
      : { done: true, value: undefined };
  }

  then<T, S>(
    f: (v: KeyboardEvent) => T | Promise<T>,
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
    listener: KeyboardEventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: KeyboardEventType,
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
    callback: KeyboardEventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
  removeEventListener(
    type: KeyboardEventType,
    listener: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void {
    super.removeEventListener(type, listener, options);
    this.#listeners[type].delete(listener);
  }

  dispose(error?: Error) {
    if (this.#disposed) {
      throw new Error("KeyCodeStream already disposed");
    }
    this.#disposed = true;
    if (this.#pullQueue.length > 0) {
      const { resolve, reject } = this.#pullQueue[0];
      this.#pullQueue.shift();
      error ? reject(error) : resolve(null);
    }
  }

  #eventLoop = async (): Promise<void> => {
    if (this.#disposed) {
      return;
    }
    await this.#read();

    // Jump into the next cycle of deno's event loop.
    await new Promise((resolve) => setTimeout(resolve));

    // Stop event loop if there are no listeners available.
    if (this.#pullQueue.length || this.#hasListeners()) {
      await this.#eventLoop();
    }
  };

  #read = async (): Promise<void> => {
    const buffer = new Uint8Array(8);
    // Deno.setRaw(Deno.stdin.rid, true, { cbreak: true });
    Deno.setRaw(Deno.stdin.rid, true);
    const nread: number | null = await Deno.stdin.read(buffer).catch(
      (error) => {
        if (!this.#disposed) {
          this.dispose(error);
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

    let keys: Array<KeyEvent>;
    try {
      keys = nread === null
        ? KeyCode.parse(buffer)
        : KeyCode.parse(buffer.subarray(0, nread));
    } catch (_) {
      // Ignore invalid characters and read again from stdin.
      return this.#read();
    }

    this.#dispatch(keys);
  };

  #dispatch = (keys: Array<KeyEvent>): void => {
    for (const key of keys) {
      const event = new KeyboardEvent("keydown", {
        ...key,
        cancelable: true,
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

  #pushEvent = (event: KeyboardEvent): void => {
    if (this.#pullQueue.length > 0) {
      const { resolve } = this.#pullQueue.shift() as PullQueueItem;
      resolve(event);
    } else {
      this.#pushQueue.push(event);
    }
  };

  #pullEvent = async (): Promise<KeyboardEvent | null> => {
    if (!this.#hasListeners()) {
      await this.#read();
    }
    return new Promise<KeyboardEvent | null>(
      (resolve: Resolver<KeyboardEvent | null>, reject: Reject) => {
        if (this.#pushQueue.length > 0) {
          const event: KeyboardEvent | null = this.#pushQueue.shift() ?? null;
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

let keyPress: Keypress;

export function keypress(): Keypress {
  if (!keyPress || keyPress.disposed) {
    keyPress = new Keypress();
  }
  return keyPress;
}
