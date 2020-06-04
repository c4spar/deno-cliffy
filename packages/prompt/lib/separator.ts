export class Separator {
  public constructor(protected value: string = "--------------") {}

  public content(): string {
    return this.value;
  }
}
