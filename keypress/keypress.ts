import { KeyCode } from "../keycode/key_code.ts";
import { KeyEvent } from "../keycode/key_event.ts";

type KeyPressEventType = "keydown" | "keyup" | "error";

interface KeyCodeOptions {
  name?: string;
  sequence?: string;
  code?: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  repeating?: boolean;
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
  public readonly repeating: boolean;
  public readonly ctrlKey: boolean;
  public readonly metaKey: boolean;
  public readonly shiftKey: boolean;
  // public readonly altKey: boolean;

  constructor(
    type: Exclude<KeyPressEventType, "error">,
    eventInitDict: KeyPressEventInit,
  ) {
    super(type, eventInitDict);
    this.key = eventInitDict.name;
    this.sequence = eventInitDict.sequence;
    this.code = eventInitDict.code;
    this.repeating = eventInitDict.repeating ?? false;
    this.ctrlKey = eventInitDict.ctrl ?? false;
    this.metaKey = eventInitDict.meta ?? false;
    this.shiftKey = eventInitDict.shift ?? false;
  }
}

export type KeyPressErrorEventListener = (
  evt: KeyPressErrorEvent,
) => void | Promise<void>;

interface KeyPressErrorEventListenerObject {
  handleEvent(evt: KeyPressErrorEvent): void | Promise<void>;
}

export type KeyPressErrorEventInit = ErrorEventInit;

type KeyPressErrorEventListenerOrEventListenerObject =
  | KeyPressErrorEventListener
  | KeyPressErrorEventListenerObject;

export class KeyPressErrorEvent extends ErrorEvent {
  constructor(eventInitDict: KeyPressErrorEventInit) {
    super("error", eventInitDict);
  }
}

type Resolver<T> = (value: T | PromiseLike<T>) => void;
type Reject = (error: Error) => void;

interface PullQueueItem {
  resolve: Resolver<KeyPressEvent | null>;
  reject: Reject;
}

export class KeyPress extends EventTarget
  implements AsyncIterableIterator<KeyPressEvent>, PromiseLike<KeyPressEvent> {
  #disposed = false;
  #pullQueue: PullQueueItem[] = [];
  #pushQueue: (KeyPressEvent | null)[] = [];
  #keyUpTimeout?: number;
  #listeners: Record<
    KeyPressEventType,
    Set<EventListenerOrEventListenerObject | null>
  > = {
    keydown: new Set(),
    keyup: new Set(),
    error: new Set(),
  };
  #lastEvent?: KeyPressEvent;

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
    type: "error",
    listener: KeyPressErrorEventListenerOrEventListenerObject | null,
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
    type: "error",
    callback: KeyPressErrorEventListenerOrEventListenerObject | null,
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
      if (this.#hasListeners()) {
        const canceled: boolean = this.dispatchEvent(
          new ErrorEvent("error", {
            error,
            cancelable: true,
            message: "Some unexpected error happened in keypress event loop",
          }),
        );
        if (canceled) {
          return this.#eventLoop();
        }
      }
      if (this.#pullQueue.length > 0) {
        const { reject } = this.#pullQueue.shift() as PullQueueItem;
        return reject(error);
      }
      throw error;
    }
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

    let keys: Array<KeyEvent & { repeating?: boolean }>;
    if (nread === null) {
      keys = KeyCode.parse(buffer);
    } else {
      keys = KeyCode.parse(buffer.subarray(0, nread));
    }

    for (const key of keys) {
      clearTimeout(this.#keyUpTimeout);
      this.#dispatchKeyPressEvent("keydown", key);
      if (this.#disposed) {
        break;
      }
      this.#keyUpTimeout = setTimeout(() => {
        this.#keyUpTimeout = undefined;
        this.#dispatchKeyPressEvent("keyup", key);
      }, this.#lastEvent?.repeating ? 100 : 500);
    }
  };

  #dispatchKeyPressEvent = (
    type: Exclude<KeyPressEventType, "error">,
    key: KeyEvent,
  ) => {
    const event = new KeyPressEvent(type, {
      ...key,
      cancelable: true,
      repeating: type === "keydown" && this.#lastEvent?.type === "keydown" &&
        this.#lastEvent.sequence === key.sequence &&
        Date.now() - this.#lastEvent.timeStamp <
          (this.#lastEvent?.repeating ? 100 : 600),
    });
    if (
      type === "keydown" && (this.#pullQueue.length || !this.#hasListeners())
    ) {
      this.#pushEvent(event);
      this.#lastEvent = event;
    }
    if (this.#hasListeners()) {
      const canceled = !this.dispatchEvent(event);
      if (canceled || this.#disposed) {
        if (!this.#disposed) {
          this.dispose();
        }
      }
      this.#lastEvent = event;
    }
    // this.#lastEvent = event;
    // console.log("last event:", this.#lastEvent.type);
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
