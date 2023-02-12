import { Secret } from "../../../secret.ts";

export const tests = import.meta.main ? null : {
  "should enter a secret": ["123", "\n"],
};

if (import.meta.main) {
  await Secret.prompt({
    message: "enter your secret",
  });
}
