import { Checkbox } from "../../../checkbox.ts";

await Checkbox.prompt({
  message: "Select an option",
  options: [
    { name: "Foo", value: "foo" },
    { name: "Bar", value: "bar" },
    { name: "Baz", value: "baz" },
  ],
});
