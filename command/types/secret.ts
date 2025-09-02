import { StringType } from "./string.ts";

/** Secret type. Allows any value, and does not show values in help text. */
export class SecretType extends StringType {
  public override defaultText(): string {
    return "******";
  }
}
