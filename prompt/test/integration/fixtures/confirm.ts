import { Confirm } from "../../../confirm.ts";

export const tests = import.meta.main ? null : {
  "should confirm": ["y", "\n"],
  "should not confirm": ["n", "\n"],
  "should not confirm by default": ["", "\n"],
};

if (import.meta.main) {
  await Confirm.prompt({
    message: "Please confirm",
    hint: "some hint",
    default: false,
  });
}
