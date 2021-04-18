import { Number } from "../../../number.ts";

await Number.prompt({
  message: "How old are you?",
  default: 7,
  max: 20,
  min: 18,
});
