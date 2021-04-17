import { Input } from "../../../input.ts";

await Input.prompt({
  message: "Whats your name?",
  default: "foo",
  suggestions: ["foo", "bar", "baz"],
  list: true,
});
