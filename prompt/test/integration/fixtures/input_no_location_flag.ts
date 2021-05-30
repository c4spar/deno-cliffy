import { Input } from "../../../input.ts";

await Input.prompt({
  message: "Works without --location?",
  default: "hope so",
});
