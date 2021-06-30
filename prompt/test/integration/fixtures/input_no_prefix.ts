import { Input } from "../../../input.ts";

await Input.prompt({
  message: "Whats your name?",
  default: "foo",
  prefix: "",
});
