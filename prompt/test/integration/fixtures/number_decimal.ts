import { ansi } from "../../../../ansi/ansi.ts";
import { Number } from "../../../number.ts";

export const tests = import.meta.main ? null : {
  "should enter a floating number": ansi
    .text("19.")
    .cursorUp
    .cursorUp
    .cursorUp
    .cursorUp
    .text("\n")
    .toArray(),
};

if (import.meta.main) {
  await Number.prompt({
    message: "How old are you?",
    default: 7,
    max: 20,
    min: 18,
    float: true,
  });
}
