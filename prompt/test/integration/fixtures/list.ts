import { List } from "../../../list.ts";

await List.prompt({
  message: "Enter some keywords",
  default: ["foo", "far"],
  hint: "some hint...",
});
