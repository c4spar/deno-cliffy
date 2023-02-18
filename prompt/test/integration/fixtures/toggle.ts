import { Toggle } from "../../../toggle.ts";

export const tests = import.meta.main ? null : {
  "should toggle the prompt": ["y", "n", "y", "\n"],
};

if (import.meta.main) {
  await Toggle.prompt({
    message: "Please confirm",
    hint: "some hint",
    default: false,
  });
}
