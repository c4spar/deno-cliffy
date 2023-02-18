import { Input } from "../../../input.ts";

export const tests = import.meta.main ? null : {
  "should change prefix": ["bar", "\n"],
};

if (import.meta.main) {
  await Input.prompt({
    message: "Whats your name?",
    default: "foo",
    prefix: "PREFIX ",
  });
}
