import { ansi } from "../../../../ansi/ansi.ts";
import { Number } from "../../../number.ts";

export const tests = import.meta.main ? null : {
  "should enter a number": ansi
    .text("19")
    .cursorUp
    .text("u")
    .cursorDown
    .cursorDown
    .cursorDown
    .cursorDown
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
  });
}
