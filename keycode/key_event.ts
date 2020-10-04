export interface IKey {
  name?: string;
  sequence?: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
}

export class KeyEvent {
  protected constructor(
    public readonly name: string | undefined,
    public readonly sequence: string | undefined,
    public readonly ctrl = false,
    public readonly meta = false,
    public readonly shift = false,
  ) {}

  public static from(key: IKey): KeyEvent {
    return new this(
      key.name,
      key.sequence,
      key.ctrl,
      key.meta,
      key.shift,
    );
  }
}
