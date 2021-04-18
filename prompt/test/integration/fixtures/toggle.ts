import { Toggle } from "../../../toggle.ts";

await Toggle.prompt({
  message: "Please confirm",
  hint: "some hint",
  default: false,
});
