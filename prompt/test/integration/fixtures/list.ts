import { List } from "../../../list.ts";

export const tests = import.meta.main ? null : {
  "should enter some keywords": ["foo,bar", "\n"],
};

if (import.meta.main) {
  await List.prompt({
    message: "Enter some keywords",
    default: ["foo", "far"],
    hint: "some hint...",
  });
}
