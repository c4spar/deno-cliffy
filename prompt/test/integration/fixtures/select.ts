import { Select } from "../../../select.ts";

await Select.prompt({
  message: "Select an option",
  options: [
    { name: "Foo", value: "foo" },
    { name: "Bar", value: "bar" },
    { name: "Baz", value: "baz" },
  ],
});
