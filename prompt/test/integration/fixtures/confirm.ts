import { Confirm } from "../../../confirm.ts";

await Confirm.prompt({
  message: "Please confirm",
  hint: "some hint",
  default: false,
});
