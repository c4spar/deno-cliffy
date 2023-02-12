import { Input } from "../../../input.ts";

export const tests = import.meta.main ? null : {
  "should enable suggestions and list": ["foo", "\n"],
};

if (import.meta.main) {
  await Input.prompt({
    message: "Whats your name?",
    default: "foo",
    suggestions: ["foo", "bar", "baz"],
    list: true,
  });
}
