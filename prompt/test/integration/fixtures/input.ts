import { Input } from "../../../input.ts";

export const tests = import.meta.main ? null : {
  "should enter som text": ["foo bar", "\n"],
};

if (import.meta.main) {
  await Input.prompt({
    message: "Whats your name?",
    default: "foo",
  });
}
